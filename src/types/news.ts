export interface NewsItem {
  id: string;
  title: string;
  source: Platform;
  sourceName: string;
  hotScore: number;
  publishTime: string;
  thumbnail?: string;
  url: string;
  author?: string;
  description?: string;
}

export type Platform =
  | 'zhihu'
  | 'weibo'
  | 'coolapk'
  | 'wallstreet'
  | 'douyin'
  | 'hupu'
  | 'tieba'
  | 'toutiao'
  | 'thepaper'
  | 'cailianpress'
  | 'xueqiu'
  | 'bilibili-hot'
  | 'bilibili-popular'
  | 'bilibili-ranking'
  | 'baidu'
  | 'nowcoder'
  | 'sspai'
  | 'juejin'
  | 'ifeng'
  | 'chongbuluo'
  | 'douban'
  | 'steam';

export interface PlatformInfo {
  key: Platform;
  name: string;
  icon: string;
  color: string;
}

export const PLATFORMS: PlatformInfo[] = [
  { key: 'zhihu', name: '知乎', icon: '📚', color: '#0066FF' },
  { key: 'weibo', name: '微博', icon: '🌟', color: '#E6162D' },
  { key: 'coolapk', name: '酷安', icon: '🎮', color: '#1DA1F2' },
  { key: 'wallstreet', name: '华尔街见闻', icon: '📈', color: '#D4A017' },
  { key: 'douyin', name: '抖音', icon: '🎵', color: '#000000' },
  { key: 'hupu', name: '虎扑', icon: '🏀', color: '#D62336' },
  { key: 'tieba', name: '百度贴吧', icon: '💬', color: '#3385FF' },
  { key: 'toutiao', name: '今日头条', icon: '📰', color: '#F85959' },
  { key: 'thepaper', name: '澎湃新闻', icon: '📊', color: '#2F323C' },
  { key: 'cailianpress', name: '财联社', icon: '💹', color: '#FF6B00' },
  { key: 'xueqiu', name: '雪球', icon: '📊', color: '#E93323' },
  { key: 'bilibili-hot', name: 'B站热搜', icon: '🔥', color: '#FB7299' },
  { key: 'bilibili-popular', name: 'B站热门视频', icon: '🎬', color: '#FB7299' },
  { key: 'bilibili-ranking', name: 'B站排行榜', icon: '📊', color: '#FB7299' },
  { key: 'baidu', name: '百度热搜', icon: '🔥', color: '#2932E1' },
  { key: 'nowcoder', name: '牛客', icon: '💼', color: '#00A4D8' },
  { key: 'sspai', name: '少数派', icon: '🔖', color: '#00B0C7' },
  { key: 'juejin', name: '稀土掘金', icon: '💎', color: '#1E80FF' },
  { key: 'ifeng', name: '凤凰网', icon: '📢', color: '#CC0000' },
  { key: 'chongbuluo', name: '虫部落', icon: '🐛', color: '#4CAF50' },
  { key: 'douban', name: '豆瓣', icon: '🎭', color: '#00B51D' },
  { key: 'steam', name: 'Steam', icon: '🎮', color: '#171A21' },
];

export const PRIORITY_PLATFORMS: PlatformInfo[] = [
  { key: 'zhihu', name: '知乎', icon: '📚', color: '#0066FF' },
  { key: 'weibo', name: '微博', icon: '🌟', color: '#E6162D' },
  { key: 'toutiao', name: '今日头条', icon: '📰', color: '#F85959' },
  { key: 'baidu', name: '百度热搜', icon: '🔥', color: '#2932E1' },
  { key: 'thepaper', name: '澎湃新闻', icon: '📊', color: '#2F323C' },
  { key: 'cailianpress', name: '财联社', icon: '💹', color: '#FF6B00' },
];
