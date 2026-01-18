import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getMockNews } from '@/data/mockData';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config', 'app-config.json');

interface PlatformConfig {
  id: number;
  key: string;
  name: string;
  apiUrl: string;
  method: 'GET' | 'POST';
  enabled: boolean;
  priority: number;
}

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

// 缓存配置文件，避免重复读取
let configCache: any = null;
let configCacheTime = 0;
const CONFIG_CACHE_TTL = 60000; // 60秒缓存

// 读取配置文件
async function readConfigFile(): Promise<any> {
  const now = Date.now();
  // 使用缓存减少文件读取
  if (configCache && (now - configCacheTime) < CONFIG_CACHE_TTL) {
    return configCache;
  }

  try {
    const content = await fs.readFile(CONFIG_FILE_PATH, 'utf-8');
    configCache = JSON.parse(content);
    configCacheTime = now;
    return configCache;
  } catch (error) {
    console.error('Failed to read config file:', error);
    throw error;
  }
}

// 根据 platform key 获取平台配置
async function getPlatformConfig(platformKey: string): Promise<PlatformConfig | null> {
  try {
    const config = await readConfigFile();
    const platforms: PlatformConfig[] = config.settings?.platforms || [];
    return platforms.find(p => p.key === platformKey) || null;
  } catch (error) {
    console.error(`Failed to get platform config for ${platformKey}:`, error);
    return null;
  }
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

async function fetchFromExternalApi(platformKey: string): Promise<NewsItem[]> {
  try {
    const platformConfig = await getPlatformConfig(platformKey);

    if (!platformConfig) {
      throw new Error(`Platform ${platformKey} not found in config`);
    }

    const apiUrl = platformConfig.apiUrl;

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
  // 将 platform 定义移到 try 块外，确保 catch 块可以访问
  const { platform } = await params;

  if (!platform) {
    return NextResponse.json({
      success: false,
      error: 'Platform is required',
    }, { status: 400 });
  }

  try {
    if (platform === 'all') {
      // 从配置文件读取启用的平台列表
      const config = await readConfigFile();
      const allPlatformsConfig: PlatformConfig[] = config.settings?.platforms || [];

      // 过滤出启用的平台
      const allPlatforms = allPlatformsConfig
        .filter(p => p.enabled)
        .map(p => p.key);

      console.log('Fetching news for all platforms:', allPlatforms);
      console.log('Total enabled platforms:', allPlatforms.length);

      const allNews: NewsItem[] = [];
      const batchSize = 4; // 增加批量大小，提升并行度

      const platformResults: Record<string, { success: boolean; count: number; error?: string }> = {};

      for (let i = 0; i < allPlatforms.length; i += batchSize) {
        const batch = allPlatforms.slice(i, i + batchSize);

        // 使用带超时的 Promise.allSettled - 8 秒超时
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Batch timeout')), 8000)
        );

        const batchPromise = Promise.allSettled(
          batch.map(p => fetchFromExternalApi(p))
        );

        try {
          const batchResults = await Promise.race([batchPromise, timeoutPromise]) as PromiseSettledResult<NewsItem[]>[];

          batchResults.forEach((result, index) => {
            const platformKey = batch[index];
            if (result.status === 'fulfilled' && Array.isArray(result.value)) {
              allNews.push(...result.value);
              platformResults[platformKey] = { success: true, count: result.value.length };
              console.log(`Platform ${platformKey}: loaded ${result.value.length} items`);
            } else {
              const error = result.status === 'rejected' ? result.reason : 'Invalid data';
              console.error(`Platform ${platformKey}: ${error}`);
              platformResults[platformKey] = { success: false, count: 0, error: String(error) };
            }
          });
        } catch (error) {
          // 批次超时或失败，继续处理下一批
          console.warn(`Batch ${i}-${i + batchSize} failed or timeout:`, error);
        }
      }

      allNews.sort((a, b) => b.hotScore - a.hotScore);

      console.log('All platforms fetch complete:', {
        totalItems: allNews.length,
        platformResults,
        successfulPlatforms: Object.values(platformResults).filter(r => r.success).length,
        failedPlatforms: Object.values(platformResults).filter(r => !r.success).length,
      });

      // 如果没有获取到任何数据，返回 Mock 数据
      if (allNews.length === 0) {
        console.warn('No data from external APIs, using mock data for /api/news/all');
        const mockData = getMockNews('all');
        return NextResponse.json({
          success: true,
          data: mockData,
          message: 'Using mock data - no external data available',
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
          }
        });
      }

      return NextResponse.json({
        success: true,
        data: allNews,
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }

    const news = await fetchFromExternalApi(platform);

    return NextResponse.json({
      success: true,
      data: news,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Failed to fetch news, using mock data:', error);
    // 超时或失败时返回 Mock 数据，确保页面始终有内容显示
    const mockData = getMockNews(platform);
    return NextResponse.json({
      success: true,
      data: mockData,
      message: 'Using mock data due to API timeout or error',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  }
}
