import { NewsItem, Platform } from '@/types/news';

export interface ParsedNews {
  title: string;
  url: string;
  hotScore?: number;
  thumbnail?: string;
  description?: string;
  author?: string;
}

/**
 * 统一API格式的解析器
 * 新的API返回统一格式，使用这个解析器处理所有平台
 */
export function parseUnifiedApiData(data: any): ParsedNews[] {
  try {
    const items = data.items || [];

    if (!Array.isArray(items)) {
      console.error('统一API返回的数据格式不正确，期望数组');
      return [];
    }

    return items.map((item: any, index: number) => {
      // 从 extra.info 中提取热度值
      let hotScore = 0;
      if (item.extra?.info) {
        const match = item.extra.info.match(/(\d+(?:\.\d+)?)/);
        if (match) {
          const value = parseFloat(match[1]);
          if (item.extra.info.includes('万')) {
            hotScore = Math.floor(value * 10000);
          } else {
            hotScore = Math.floor(value);
          }
        }
      }

      return {
        title: item.title || '',
        url: item.url || '',
        hotScore: hotScore || (items.length - index) * 100000,
        thumbnail: item.pic || item.thumbnail || item.img || '',
        description: item.extra?.hover || '',
        author: '',
      };
    });
  } catch (error) {
    console.error('解析统一API数据失败:', error);
    return [];
  }
}

export class NewsParser {
  static parseZhihu(data: any): ParsedNews[] {
    try {
      const items = data.data || [];
      return items.map((item: any) => ({
        title: item.target?.title || item.title || '',
        url: item.target?.url || `https://www.zhihu.com/question/${item.target?.id}`,
        hotScore: item.detail_text ? parseInt(item.detail_text.replace(/\D/g, '')) || 0 : 0,
        thumbnail: item.target?.thumbnail || item.target?.image,
        description: item.target?.excerpt,
      }));
    } catch (error) {
      console.error('解析知乎数据失败:', error);
      return [];
    }
  }

  static parseWeibo(data: any): ParsedNews[] {
    try {
      if (typeof data === 'string') {
        // 尝试从 HTML 中解析
        const hotListRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
        const matches = [...data.matchAll(hotListRegex)];
        return matches.slice(0, 20).map((match, index) => ({
          title: match[2],
          url: `https://s.weibo.com${match[1]}`,
          hotScore: 1000000 - index * 10000,
        }));
      }
      return [];
    } catch (error) {
      console.error('解析微博数据失败:', error);
      return [];
    }
  }

  static parseDouyin(data: any): ParsedNews[] {
    try {
      // 新的抖音 API 格式
      const wordList = data.data?.word_list || [];

      return wordList.map((item: any) => {
        // 提取封面图片（取第一个 URL）
        const thumbnail = item.word_cover?.url_list?.[0] || '';

        return {
          title: item.word || '',
          url: `https://www.douyin.com/search/${encodeURIComponent(item.word || '')}`,
          hotScore: item.hot_value || 0,
          thumbnail: thumbnail,
          description: `视频数量: ${item.video_count || 0}`,
        };
      });
    } catch (error) {
      console.error('解析抖音数据失败:', error);
      return [];
    }
  }

  static parseBilibili(data: any): ParsedNews[] {
    try {
      const items = data.data?.list || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: `https://www.bilibili.com/video/${item.bvid}`,
        hotScore: item.stat?.view || 0,
        thumbnail: item.pic,
        author: item.owner?.name,
      }));
    } catch (error) {
      console.error('解析B站数据失败:', error);
      return [];
    }
  }

  // B站热搜解析
  static parseBilibiliHot(data: any): ParsedNews[] {
    try {
      const trending = data.data?.trending?.list || [];
      return trending.map((item: any, index: number) => ({
        title: item.keyword || '',
        url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(item.keyword || '')}`,
        hotScore: (trending.length - index) * 100000,
      }));
    } catch (error) {
      console.error('解析B站热搜数据失败:', error);
      return [];
    }
  }

  // B站热门视频解析
  static parseBilibiliPopular(data: any): ParsedNews[] {
    try {
      const items = data.data?.list || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: `https://www.bilibili.com/video/${item.bvid}`,
        hotScore: item.stat?.view || 0,
        thumbnail: item.pic,
        author: item.owner?.name,
      }));
    } catch (error) {
      console.error('解析B站热门视频数据失败:', error);
      return [];
    }
  }

  // B站排行榜解析
  static parseBilibiliRanking(data: any): ParsedNews[] {
    try {
      const items = data.data?.list || [];
      return items.map((item: any, index: number) => ({
        title: item.title || '',
        url: `https://www.bilibili.com/video/${item.bvid}`,
        hotScore: item.stat?.view || (items.length - index) * 100000,
        thumbnail: item.pic,
        author: item.owner?.name,
      }));
    } catch (error) {
      console.error('解析B站排行榜数据失败:', error);
      return [];
    }
  }

  static parseToutiao(data: any): ParsedNews[] {
    try {
      const items = data.data?.data || [];
      return items.map((item: any) => ({
        title: item.title || item.Title || '',
        url: item.url || item.Url || '',
        hotScore: item.hot_value || item.HotValue || 0,
        thumbnail: item.image_url || item.ImageUrl,
      }));
    } catch (error) {
      console.error('解析今日头条数据失败:', error);
      return [];
    }
  }

  static parseBaidu(data: any): ParsedNews[] {
    try {
      const items = data.data?.cards?.[0]?.content || [];
      return items.map((item: any) => ({
        title: item.word || item.query || '',
        url: `https://www.baidu.com/s?wd=${encodeURIComponent(item.word || item.query)}`,
        hotScore: item.hotScore || 0,
      }));
    } catch (error) {
      console.error('解析百度热搜数据失败:', error);
      return [];
    }
  }

  static parseThespaper(data: any): ParsedNews[] {
    try {
      const items = data.data || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: `https://m.thepaper.cn/newsDetail_forward_${item.contId}`,
        thumbnail: item.pic,
        author: item.author,
      }));
    } catch (error) {
      console.error('解析澎湃新闻数据失败:', error);
      return [];
    }
  }

  static parseHupu(data: any): ParsedNews[] {
    try {
      const items = data.data || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: `https://bbs.hupu.com/${item.tid}.html`,
        hotScore: item.lightNum || 0,
      }));
    } catch (error) {
      console.error('解析虎扑数据失败:', error);
      return [];
    }
  }

  static parseXueqiu(data: any): ParsedNews[] {
    try {
      const items = data.statuses || [];
      return items.map((item: any) => ({
        title: item.description || '',
        url: `https://xueqiu.com/${item.id}`,
        hotScore: item.retweet_count || 0,
        author: item.user?.name,
      }));
    } catch (error) {
      console.error('解析雪球数据失败:', error);
      return [];
    }
  }

  static parseKuaishou(data: any): ParsedNews[] {
    try {
      const items = data.data?.feeds || [];
      return items.map((item: any) => ({
        title: item.caption || item.title || '',
        url: `https://www.kuaishou.com/short-video/${item.photoId}`,
        hotScore: item.viewCount || 0,
        thumbnail: item.coverUrls?.[0],
      }));
    } catch (error) {
      console.error('解析快手数据失败:', error);
      return [];
    }
  }

  static parseNowcoder(data: any): ParsedNews[] {
    try {
      const items = data.data || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: `https://www.nowcoder.com/discuss/${item.id}`,
        hotScore: item.viewCount || 0,
      }));
    } catch (error) {
      console.error('解析牛客数据失败:', error);
      return [];
    }
  }

  static parseSspai(data: any): ParsedNews[] {
    try {
      const items = data.data || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: `https://sspai.com/post/${item.id}`,
        thumbnail: item.promo_image?.large,
        author: item.author?.nickname,
      }));
    } catch (error) {
      console.error('解析少数派数据失败:', error);
      return [];
    }
  }

  static parseIfeng(data: any): ParsedNews[] {
    try {
      const items = data.data || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: item.url || '',
        thumbnail: item.thumbnail,
      }));
    } catch (error) {
      console.error('解析凤凰网数据失败:', error);
      return [];
    }
  }

  static parseDouban(data: any): ParsedNews[] {
    try {
      const items = data.subject_collection_items || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: item.url || '',
        thumbnail: item.cover?.url,
        description: item.rating?.value ? `豆瓣评分: ${item.rating.value}` : '',
      }));
    } catch (error) {
      console.error('解析豆瓣数据失败:', error);
      return [];
    }
  }

  static parseWallstreet(data: any): ParsedNews[] {
    try {
      // 新API格式：直接从 data.items 获取
      const items = data.items || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: item.url || item.uri || '',
        thumbnail: item.image,
      }));
    } catch (error) {
      console.error('解析华尔街见闻数据失败:', error);
      return [];
    }
  }

  static parseCoolapk(data: any): ParsedNews[] {
    try {
      const items = data.data || [];
      return items.map((item: any) => ({
        title: item.title || item.message || '',
        url: `https://www.coolapk.com/feed/${item.id}`,
        thumbnail: item.pic,
        author: item.username,
      }));
    } catch (error) {
      console.error('解析酷安数据失败:', error);
      return [];
    }
  }

  static parseTieba(data: any): ParsedNews[] {
    try {
      if (typeof data === 'string') {
        const hotListRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
        const matches = [...data.matchAll(hotListRegex)];
        return matches.slice(0, 20).map((match, index) => ({
          title: match[2],
          url: match[1].startsWith('http') ? match[1] : `https://tieba.baidu.com${match[1]}`,
          hotScore: 1000000 - index * 10000,
        }));
      }
      return [];
    } catch (error) {
      console.error('解析百度贴吧数据失败:', error);
      return [];
    }
  }

  static parseCailianpress(data: any): ParsedNews[] {
    try {
      const items = data.data?.list || [];
      return items.map((item: any) => ({
        title: item.title || '',
        url: item.url || '',
        thumbnail: item.imgUrl,
      }));
    } catch (error) {
      console.error('解析财联社数据失败:', error);
      return [];
    }
  }

  /**
   * 根据平台解析数据
   * 新的API使用统一格式，所有平台都使用 parseUnifiedApiData
   * 抖音使用专门的解析器
   */
  static parseByPlatform(platform: string, data: any): ParsedNews[] {
    // 抖音使用专门的解析器
    if (platform === 'douyin') {
      return this.parseDouyin(data);
    }

    // 其他平台使用统一解析器
    const parsedNews = parseUnifiedApiData(data);

    // 对特定平台进行额外过滤
    if (platform === 'douyin') {
      return this.filterDouyinLinks(parsedNews);
    }

    return parsedNews;
  }

  /**
   * 过滤抖音无效链接
   * 移除无效或不可访问的抖音链接
   */
  private static filterDouyinLinks(news: ParsedNews[]): ParsedNews[] {
    return news.filter(item => {
      // 过滤空链接
      if (!item.url || item.url.trim() === '') {
        return false;
      }

      // 过滤非抖音域名的链接
      if (!item.url.includes('douyin.com')) {
        return false;
      }

      // 过滤明显的搜索链接（如搜索页、用户页等非视频内容）
      // 保留 /hot/{id} 和 /video/{id} 格式的链接
      const validPatterns = [
        /douyin\.com\/hot\/\d+/,      // 热榜话题
        /douyin\.com\/video\/[\w-]+/, // 视频页面
      ];

      const isValidPattern = validPatterns.some(pattern => pattern.test(item.url));

      // 如果不符合有效模式，过滤掉
      if (!isValidPattern) {
        console.log(`过滤无效抖音链接: ${item.url}`);
        return false;
      }

      // 过滤标题为空或过短的内容（可能已删除）
      if (!item.title || item.title.trim().length < 2) {
        console.log(`过滤无效抖音内容（标题为空或过短）: ${item.title}`);
        return false;
      }

      return true;
    });
  }

  static convertToNewsItem(parsed: ParsedNews, platform: Platform, platformName: string): NewsItem {
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: parsed.title,
      source: platform,
      sourceName: platformName,
      hotScore: parsed.hotScore || 0,
      publishTime: new Date().toISOString(),
      thumbnail: parsed.thumbnail,
      url: parsed.url,
      author: parsed.author,
      description: parsed.description,
    };
  }
}
