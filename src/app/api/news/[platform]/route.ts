import { NextResponse } from 'next/server';
import { getMockNews, getRealtimeNews } from '@/data/mockData';
import { PLATFORMS_CONFIG, PlatformConfig } from '@/lib/config';

export const runtime = 'edge';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceName: string;
  hotScore: number;
  publishTime: string;
  thumbnail?: string;
  url: string;
  author?: string;
  description?: string;
}

// 根据 platform key 获取平台配置
function getPlatformConfig(platformKey: string): PlatformConfig | null {
  const platforms = PLATFORMS_CONFIG.settings.platforms;
  return platforms.find((p: any) => p.key === platformKey) || null;
}

// 带超时的 fetch
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

async function fetchFromExternalApi(platformKey: string, type: 'hot' | 'realtime' = 'hot'): Promise<NewsItem[]> {
  try {
    const platformConfig = getPlatformConfig(platformKey);

    if (!platformConfig) {
      throw new Error(`Platform ${platformKey} not found in config`);
    }

    // 根据类型选择 API URL
    let apiUrl: string;
    if (type === 'realtime' && platformConfig.realtimeApiUrl) {
      apiUrl = platformConfig.realtimeApiUrl;
    } else {
      apiUrl = (platformConfig as any).apiUrl;
    }

    // 使用带超时的 fetch，避免慢接口拖累整体性能
    const response = await fetchWithTimeout(apiUrl, {
      method: platformConfig.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 缓存策略：5分钟重新验证
      next: { revalidate: 300 },
    }, 5000); // 5秒超时

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const data = await response.json();

    // 兼容不同的外部 API 数据格式
    // 格式1: { success: true, data: [...] }
    // 格式2: { status: "success", items: [...] }
    // 格式3: { data: { trending_list: [...] } } (douyin)
    // 格式4: { data: { items: [...] } }
    const rawData = data.data?.trending_list || data.data?.items || data.items || data.data || [];

    // 特殊处理 douyin 平台的数据格式
    if (platformKey === 'douyin' && Array.isArray(rawData)) {
      return rawData.map((item: any) => ({
        id: item.group_id || String(Date.now() + Math.random()),
        title: item.word || '无标题',
        source: platformKey,
        sourceName: platformConfig.name,
        hotScore: item.hot_value || 0,
        publishTime: '刚刚',
        thumbnail: item.word_cover?.url_list?.[0] || undefined,
        url: `https://www.douyin.com/search/${encodeURIComponent(item.word)}`,
        description: undefined,
      }));
    }

    if (Array.isArray(rawData)) {
      return rawData.map((item: any) => ({
        id: item.id || String(Date.now() + Math.random()),
        title: item.title || '无标题',
        source: platformKey,
        sourceName: platformConfig.name,
        hotScore: item.hotScore || extractHotScore(item.extra?.info) || 0,
        publishTime: item.publishTime || item.time || item.updatedTime || '刚刚',
        thumbnail: item.thumbnail || item.cover || undefined,
        url: item.url || '#',
        author: item.author,
        description: item.description || item.extra?.hover,
      }));
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch from external API for ${platformKey}:`, error);
    throw error;
  }
}

// 从热度文本中提取数字（如 "1389 万热度" -> 13890000）
function extractHotScore(info?: string): number {
  if (!info) return 0;

  const match = info.match(/(\d+\.?\d*)\s*(万|亿)?/);
  if (!match) return 0;

  const number = parseFloat(match[1]);
  const unit = match[2];

  if (unit === '万') {
    return Math.floor(number * 10000);
  } else if (unit === '亿') {
    return Math.floor(number * 100000000);
  }

  return Math.floor(number);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;

  // 从 URL 中获取查询参数
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') as 'hot' | 'realtime') || 'hot';

  if (!platform) {
    return NextResponse.json({
      success: false,
      error: 'Platform is required',
    }, { status: 400 });
  }

  try {
    if (platform === 'all') {
      // 从配置文件读取启用的平台列表
      const allPlatformsConfig = PLATFORMS_CONFIG.settings.platforms;

      // 过滤出启用的平台
      const allPlatforms = allPlatformsConfig
        .filter(p => p.enabled)
        .map(p => p.key);

      console.log(`Fetching all platforms (type=${type}):`, allPlatforms);

      // 并行获取所有平台的数据
      const results = await Promise.allSettled(
        allPlatforms.map(p => fetchFromExternalApi(p, type))
      );

      // 收集所有成功的请求
      const allNews: NewsItem[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allNews.push(...result.value);
        } else {
          console.error(`Failed to fetch platform ${allPlatforms[index]}:`, result.reason);
          // 如果某个平台失败，使用 mock 数据
          const mockData = type === 'realtime' ? getRealtimeNews(allPlatforms[index], 20) : getMockNews(allPlatforms[index]);
          allNews.push(...mockData);
        }
      });

      // 按热度排序
      allNews.sort((a, b) => b.hotScore - a.hotScore);

      return NextResponse.json({
        success: true,
        data: allNews,
      });
    } else {
      // 获取单个平台的数据
      const news = await fetchFromExternalApi(platform, type);

      return NextResponse.json({
        success: true,
        data: news,
      });
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 降级到 mock 数据
    const mockData = type === 'realtime' ? getRealtimeNews(platform, 20) : getMockNews(platform);

    return NextResponse.json({
      success: true,
      data: mockData,
      message: `Using mock data due to error: ${errorMessage}`,
    });
  }
}
