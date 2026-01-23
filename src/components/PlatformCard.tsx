'use client';

import NewsCard from './NewsCard';
import PlatformIcon from './PlatformIcon';
import type { NewsItem, PlatformInfo } from '@/types/news';

interface PlatformCardProps {
  platform: PlatformInfo;
  news: NewsItem[];
  limit?: number;
}

export default function PlatformCard({
  platform,
  news,
  limit = 3,
}: PlatformCardProps) {
  const displayedNews = news.slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* 卡片头部 */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={platform.key} size={18} />
          <h3 className="font-semibold text-gray-900 text-sm">{platform.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {news.length}
          </span>
        </div>
      </div>

      {/* 新闻列表 - 固定显示前三条 */}
      <div className="px-3 py-2 space-y-2">
        {displayedNews.map((item, index) => (
          <NewsCard
            key={`${item.id}-${index}`}
            news={item}
            platform={platform}
            compact
          />
        ))}
      </div>
    </div>
  );
}
