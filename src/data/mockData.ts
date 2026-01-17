import { NewsItem, Platform } from '@/types/news';

const now = new Date();

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getRandomHotScore() {
  return Math.floor(Math.random() * 10000000) + 100000;
}

function getRandomTimeOffset() {
  const hours = Math.floor(Math.random() * 12);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}小时${minutes}分钟前`;
}

const mockNewsData: NewsItem[] = [
  // 知乎
  {
    id: generateId(),
    title: '如何看待2025年AI技术发展的新趋势？',
    source: 'zhihu' as Platform,
    sourceName: '知乎',
    hotScore: 8923000,
    publishTime: getRandomTimeOffset(),
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    url: 'https://www.zhihu.com',
    author: '科技前沿',
    description: '随着大语言模型的快速发展，AI技术在各个领域的应用越来越广泛...'
  },
  {
    id: generateId(),
    title: '有哪些值得推荐的编程学习资源？',
    source: 'zhihu' as Platform,
    sourceName: '知乎',
    hotScore: 5678000,
    publishTime: getRandomTimeOffset(),
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    url: 'https://www.zhihu.com',
  },
  {
    id: generateId(),
    title: '如何看待远程办公的未来？',
    source: 'zhihu' as Platform,
    sourceName: '知乎',
    hotScore: 4521000,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.zhihu.com',
  },

  // 微博
  {
    id: generateId(),
    title: '#科技新闻# 全球AI竞赛白热化，多家公司发布新一代模型',
    source: 'weibo' as Platform,
    sourceName: '微博',
    hotScore: 12345678,
    publishTime: getRandomTimeOffset(),
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    url: 'https://weibo.com',
    author: '科技日报',
  },
  {
    id: generateId(),
    title: '#娱乐# 最新热门剧集口碑炸裂',
    source: 'weibo' as Platform,
    sourceName: '微博',
    hotScore: 9876543,
    publishTime: getRandomTimeOffset(),
    url: 'https://weibo.com',
  },
  {
    id: generateId(),
    title: '#体育# 世界杯预选赛精彩集锦',
    source: 'weibo' as Platform,
    sourceName: '微博',
    hotScore: 7654321,
    publishTime: getRandomTimeOffset(),
    url: 'https://weibo.com',
  },

  // 今日头条
  {
    id: generateId(),
    title: '新能源汽车行业迎来新突破，续航里程创新高',
    source: 'toutiao' as Platform,
    sourceName: '今日头条',
    hotScore: 8765432,
    publishTime: getRandomTimeOffset(),
    thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop',
    url: 'https://www.toutiao.com',
    description: '多家车企发布新款电动车，续航里程突破1000公里...'
  },
  {
    id: generateId(),
    title: '数字经济成为推动经济增长新引擎',
    source: 'toutiao' as Platform,
    sourceName: '今日头条',
    hotScore: 6543210,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.toutiao.com',
  },
  {
    id: generateId(),
    title: '房地产市场迎来政策利好，多地出台购房补贴',
    source: 'toutiao' as Platform,
    sourceName: '今日头条',
    hotScore: 5432109,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.toutiao.com',
  },

  // 百度热搜
  {
    id: generateId(),
    title: '高考改革最新政策解读',
    source: 'baidu' as Platform,
    sourceName: '百度热搜',
    hotScore: 11234567,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.baidu.com',
  },
  {
    id: generateId(),
    title: '天气预报：未来一周将迎来寒潮',
    source: 'baidu' as Platform,
    sourceName: '百度热搜',
    hotScore: 9087654,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.baidu.com',
  },
  {
    id: generateId(),
    title: '科技创新引领产业升级',
    source: 'baidu' as Platform,
    sourceName: '百度热搜',
    hotScore: 7654321,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.baidu.com',
  },

  // 澎湃新闻
  {
    id: generateId(),
    title: '国家重大科技项目取得阶段性成果',
    source: 'thepaper' as Platform,
    sourceName: '澎湃新闻',
    hotScore: 4567890,
    publishTime: getRandomTimeOffset(),
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    url: 'https://www.thepaper.cn',
    author: '记者：张三',
  },
  {
    id: generateId(),
    title: '教育改革持续推进，促进学生全面发展',
    source: 'thepaper' as Platform,
    sourceName: '澎湃新闻',
    hotScore: 3456789,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.thepaper.cn',
  },
  {
    id: generateId(),
    title: '城市治理现代化迈出新步伐',
    source: 'thepaper' as Platform,
    sourceName: '澎湃新闻',
    hotScore: 2345678,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.thepaper.cn',
  },

  // 财联社
  {
    id: generateId(),
    title: '央行发布最新货币政策报告，透露哪些信号？',
    source: 'cailianpress' as Platform,
    sourceName: '财联社',
    hotScore: 6789012,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.cailianpress.com',
    description: '报告显示，货币政策将保持稳健中性，支持实体经济...'
  },
  {
    id: generateId(),
    title: 'A股市场今日表现亮眼，三大指数集体收涨',
    source: 'cailianpress' as Platform,
    sourceName: '财联社',
    hotScore: 5678901,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.cailianpress.com',
  },
  {
    id: generateId(),
    title: '新能源汽车产业链持续升温，多只股票涨停',
    source: 'cailianpress' as Platform,
    sourceName: '财联社',
    hotScore: 4567890,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.cailianpress.com',
  },

  // 虎扑
  {
    id: generateId(),
    title: 'NBA季后赛预测：谁能夺冠？',
    source: 'hupu' as Platform,
    sourceName: '虎扑',
    hotScore: 7654321,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.hupu.com',
  },
  {
    id: generateId(),
    title: '足球五大联赛最新积分榜',
    source: 'hupu' as Platform,
    sourceName: '虎扑',
    hotScore: 5432109,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.hupu.com',
  },
  {
    id: generateId(),
    title: '电竞战队转会市场动态',
    source: 'hupu' as Platform,
    sourceName: '虎扑',
    hotScore: 4321098,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.hupu.com',
  },

  // 雪球
  {
    id: generateId(),
    title: '如何看待当前科技股的投资机会？',
    source: 'xueqiu' as Platform,
    sourceName: '雪球',
    hotScore: 3456789,
    publishTime: getRandomTimeOffset(),
    url: 'https://xueqiu.com',
    description: '科技股近期波动较大，投资者需要谨慎...'
  },
  {
    id: generateId(),
    title: '财报季来临，这些股票值得关注',
    source: 'xueqiu' as Platform,
    sourceName: '雪球',
    hotScore: 2345678,
    publishTime: getRandomTimeOffset(),
    url: 'https://xueqiu.com',
  },

  // 哔哩哔哩热搜
  {
    id: generateId(),
    title: '2025年最值得期待的动漫新番',
    source: 'bilibili-hot' as Platform,
    sourceName: 'B站热搜',
    hotScore: 9876543,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.bilibili.com',
  },
  {
    id: generateId(),
    title: 'UP主创作工具推荐',
    source: 'bilibili-hot' as Platform,
    sourceName: 'B站热搜',
    hotScore: 8765432,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.bilibili.com',
  },

  // 少数派
  {
    id: generateId(),
    title: '提升效率的10个实用工具',
    source: 'sspai' as Platform,
    sourceName: '少数派',
    hotScore: 1234567,
    publishTime: getRandomTimeOffset(),
    url: 'https://sspai.com',
    description: '这些工具能帮你更好地管理时间和任务...'
  },
  {
    id: generateId(),
    title: '2025年数码产品购买指南',
    source: 'sspai' as Platform,
    sourceName: '少数派',
    hotScore: 987654,
    publishTime: getRandomTimeOffset(),
    url: 'https://sspai.com',
  },

  // 稀土掘金
  {
    id: generateId(),
    title: '前端性能优化最佳实践',
    source: 'juejin' as Platform,
    sourceName: '稀土掘金',
    hotScore: 2345678,
    publishTime: getRandomTimeOffset(),
    url: 'https://juejin.cn',
  },
  {
    id: generateId(),
    title: 'AI大模型在编程中的应用',
    source: 'juejin' as Platform,
    sourceName: '稀土掘金',
    hotScore: 1987654,
    publishTime: getRandomTimeOffset(),
    url: 'https://juejin.cn',
  },

  // 豆瓣
  {
    id: generateId(),
    title: '2025年必看电影清单',
    source: 'douban' as Platform,
    sourceName: '豆瓣',
    hotScore: 5432109,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.douban.com',
  },
  {
    id: generateId(),
    title: '高分电视剧推荐',
    source: 'douban' as Platform,
    sourceName: '豆瓣',
    hotScore: 4321098,
    publishTime: getRandomTimeOffset(),
    url: 'https://www.douban.com',
  },
];

export function getMockNews(platform?: string): NewsItem[] {
  if (platform && platform !== 'all') {
    return mockNewsData.filter(news => news.source === platform);
  }
  return mockNewsData.sort((a, b) => b.hotScore - a.hotScore);
}

export function getHotNewsByPlatform(platform: string): NewsItem[] {
  return mockNewsData
    .filter(news => news.source === platform)
    .sort((a, b) => b.hotScore - a.hotScore);
}

export function getTopNews(limit: number = 10): NewsItem[] {
  return mockNewsData
    .sort((a, b) => b.hotScore - a.hotScore)
    .slice(0, limit);
}

export function searchNews(keyword: string): NewsItem[] {
  const lowerKeyword = keyword.toLowerCase();
  return mockNewsData.filter(news =>
    news.title.toLowerCase().includes(lowerKeyword) ||
    news.description?.toLowerCase().includes(lowerKeyword) ||
    news.sourceName.toLowerCase().includes(lowerKeyword)
  );
}

export function getLatestNews(platform?: string, limit: number = 20): NewsItem[] {
  let newsData = mockNewsData;

  if (platform && platform !== 'all') {
    newsData = mockNewsData.filter(news => news.source === platform);
  }

  // 模拟实时数据：使用当前时间
  const now = new Date();
  const latestData = newsData.slice(0, limit).map((news, index) => {
    const minutesAgo = Math.floor(Math.random() * 60) + index * 2;
    return {
      ...news,
      id: generateId(),
      publishTime: `${minutesAgo}分钟前`,
      description: news.description || '这是一条最新发布的资讯内容，实时更新中...'
    };
  });

  return latestData.sort((a, b) => {
    const timeA = parseInt(a.publishTime);
    const timeB = parseInt(b.publishTime);
    return timeA - timeB;
  });
}
