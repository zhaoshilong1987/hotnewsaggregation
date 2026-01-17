'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, Flame } from 'lucide-react';
import NewsCard from './NewsCard';
import PlatformIcon from './PlatformIcon';
import type { NewsItem, PlatformInfo } from '@/types/news';

interface PlatformCardProps {
  platform: PlatformInfo;
  news: NewsItem[];
  limit?: number;
  onExpand?: () => void;
}

export default function PlatformCard({
  platform,
  news,
  limit = 5,
  onExpand,
}: PlatformCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayCount, setDisplayCount] = useState(limit);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 平台标签顺序变化时重置状态
  useEffect(() => {
    setIsExpanded(false);
    setDisplayCount(limit);
  }, [platform.key, limit]);

  const displayedNews = news.slice(0, isExpanded ? news.length : displayCount);
  const hasMore = news.length > displayCount;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    // 滚动到底部时加载更多
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10 &&
      isExpanded &&
      displayCount < news.length
    ) {
      setDisplayCount(prev => Math.min(prev + 5, news.length));
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
    if (onExpand) {
      onExpand();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* 卡片头部 */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={platform.key} size={20} />
          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {news.length}
          </span>
        </div>
        {!isExpanded && hasMore && (
          <button
            onClick={handleExpand}
            className="text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 新闻列表 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
        style={{ maxHeight: '400px' }}
      >
        {displayedNews.map((item, index) => (
          <NewsCard
            key={`${item.id}-${index}`}
            news={item}
            platform={platform}
            compact
          />
        ))}

        {displayedNews.length < news.length && isExpanded && (
          <div className="text-center py-2 text-sm text-gray-400">
            下滑加载更多...
          </div>
        )}
      </div>

      {/* 底部渐变遮罩 */}
      {!isExpanded && hasMore && (
        <div className="px-3 pb-2">
          <button
            onClick={handleExpand}
            className="w-full py-2 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            还有 {news.length - displayCount} 条内容
          </button>
        </div>
      )}
    </div>
  );
}
