'use client';

import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import PlatformIcon from './PlatformIcon';
import type { NewsItem, PlatformInfo } from '@/types/news';
import { Heart } from 'lucide-react';

interface PlatformCardProps {
  platform: PlatformInfo;
  news: NewsItem[];
  limit?: number;
  isFollowing?: boolean;
  onToggleFollow?: (platformKey: string) => void;
  type?: 'hot' | 'realtime'; // 新增：卡片类型（热榜或实时）
}

export default function PlatformCard({
  platform,
  news,
  limit = 3,
  isFollowing = false,
  onToggleFollow,
  type = 'hot',
}: PlatformCardProps) {
  const [displayCount, setDisplayCount] = useState(limit);

  // 平台变化时重置显示数量
  useEffect(() => {
    setDisplayCount(limit);
  }, [platform.key, limit]);

  const displayedNews = news.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 5, news.length));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* 卡片头部 */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={platform.key} size={18} />
          <h3 className="font-semibold text-gray-900 text-sm">{platform.name}</h3>
          {/* 类型标签 */}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            type === 'hot'
              ? 'bg-orange-100 text-orange-600'
              : 'bg-blue-100 text-blue-600'
          }`}>
            {type === 'hot' ? '热榜' : '实时'}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {news.length}
          </span>
        </div>

        {/* 关注按钮 */}
        {onToggleFollow && (
          <button
            onClick={() => onToggleFollow(platform.key)}
            className={`p-1.5 rounded-full transition-colors ${
              isFollowing
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* 新闻列表 */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2 scrollbar-hide"
        style={{ maxHeight: '300px', minHeight: '200px' }}
      >
        {displayedNews.map((item, index) => (
          <NewsCard
            key={`${item.id}-${index}`}
            news={item}
            platform={platform}
            rank={index + 1}
            compact
            showTimeline={type === 'realtime'} // 实时模式显示时间线
            isHotList={type === 'hot'} // 热榜模式显示排名
          />
        ))}

        {/* 如果有更多内容，显示加载更多按钮 */}
        {displayedNews.length < news.length && (
          <button
            onClick={handleLoadMore}
            className="w-full text-center py-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            加载更多
          </button>
        )}
      </div>
    </div>
  );
}
