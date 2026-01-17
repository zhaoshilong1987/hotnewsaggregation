'use client';

import { Platform } from '@/types/news';
import Image from 'next/image';

interface PlatformIconProps {
  platform: Platform;
  className?: string;
  size?: number;
}

export default function PlatformIcon({ platform, className = '', size = 20 }: PlatformIconProps) {
  const icons: Record<Platform, React.ReactNode> = {
    zhihu: (
      <Image
        src="/知乎.png"
        alt="知乎"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    weibo: (
      <Image
        src="/微博.jpeg"
        alt="微博"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    toutiao: (
      <Image
        src="/今日头条.jfif"
        alt="今日头条"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    baidu: (
      <Image
        src="/百度热搜.png"
        alt="百度热搜"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    thepaper: (
      <Image
        src="/澎湃新闻.jfif"
        alt="澎湃新闻"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    cailianpress: (
      <Image
        src="/财联社.jfif"
        alt="财联社"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    wallstreet: (
      <Image
        src="/华尔街见闻.png"
        alt="华尔街见闻"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    coolapk: (
      <Image
        src="/酷安.jfif"
        alt="酷安"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    douyin: (
      <Image
        src="/抖音.jfif"
        alt="抖音"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    hupu: (
      <Image
        src="/虎扑.jfif"
        alt="虎扑"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    tieba: (
      <Image
        src="/百度贴吧.jfif"
        alt="百度贴吧"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    xueqiu: (
      <Image
        src="/雪球.png"
        alt="雪球"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    'bilibili-hot': (
      <Image
        src="/哔哩哔哩.jfif"
        alt="哔哩哔哩热搜"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    'bilibili-popular': (
      <Image
        src="/哔哩哔哩.jfif"
        alt="哔哩哔哩热门"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    'bilibili-ranking': (
      <Image
        src="/哔哩哔哩.jfif"
        alt="哔哩哔哩排行榜"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    nowcoder: (
      <Image
        src="/牛客.jfif"
        alt="牛客"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    sspai: (
      <Image
        src="/少数派.jfif"
        alt="少数派"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    ifeng: (
      <Image
        src="/凤凰网.jfif"
        alt="凤凰网"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    douban: (
      <Image
        src="/豆瓣.jfif"
        alt="豆瓣"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    juejin: (
      <Image
        src="/稀土掘金.jpeg"
        alt="稀土掘金"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    chongbuluo: (
      <Image
        src="/虫部落.jpeg"
        alt="虫部落"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
    steam: (
      <Image
        src="/steam.jpeg"
        alt="Steam"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    ),
  };

  return icons[platform] || null;
}
