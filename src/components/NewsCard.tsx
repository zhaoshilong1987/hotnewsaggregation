'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Flame, ExternalLink, X, Heart, Share2 } from 'lucide-react';
import PlatformIcon from '@/components/PlatformIcon';

interface NewsCardProps {
  news: {
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
  };
  platform?: {
    name: string;
    color: string;
  };
  rank?: number;
  onRemove?: (id: string) => void;
  onBookmark?: (id: string) => void;
  showBookmark?: boolean;
  compact?: boolean;
  showTimeline?: boolean; // 新增：是否显示时间线
}

const PLATFORM_COLORS: Record<string, string> = {
  'zhihu': '#0066FF',
  'weibo': '#E6162D',
  'toutiao': '#F85959',
  'baidu': '#2932E1',
  'thepaper': '#2F323C',
  'cailianpress': '#FF6B00',
};

export default function NewsCard({ news, platform, rank, onRemove, onBookmark, showBookmark = true, compact = false, showTimeline = false }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 检查是否已收藏
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('bookmarks');
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        const bookmarked = bookmarks.some((item: any) => item.id === news.id);
        setIsBookmarked(bookmarked);
      }
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  }, [news.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const savedBookmarks = localStorage.getItem('bookmarks');
      let bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];

      if (isBookmarked) {
        // 取消收藏
        bookmarks = bookmarks.filter((item: any) => item.id !== news.id);
      } else {
        // 添加收藏
        bookmarks.unshift(news); // 添加到列表开头
      }

      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(!isBookmarked);

      // 调用回调函数
      if (onBookmark) {
        onBookmark(news.id);
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // 构建分享文本
      const shareText = `${news.title}\n\n来自：${news.sourceName}\n\n${news.url}`;

      // 检查是否支持原生分享API（移动端）
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          text: shareText,
          url: news.url,
        });
      } else {
        // 桌面端或其他不支持的情况，复制链接到剪贴板
        await navigator.clipboard.writeText(news.url);

        // 显示提示
        alert('链接已复制到剪贴板！');
      }
    } catch (error) {
      // 用户取消分享或复制失败
      if ((error as Error).name !== 'AbortError') {
        console.error('分享失败:', error);
        alert('分享失败，请重试');
      }
    }
  };

  const formatHotScore = (score: number): string => {
    if (score >= 10000000) {
      return `${(score / 10000000).toFixed(1)}千万`;
    } else if (score >= 10000) {
      return `${(score / 10000).toFixed(1)}万`;
    }
    return score.toString();
  };

  const formatPublishTime = (timeStr: string): string => {
    // 如果已经是相对时间格式（包含"前"、"小时"、"分钟"等关键词），直接返回
    if (timeStr && (timeStr.includes('前') || timeStr.includes('小时') || timeStr.includes('分钟') || timeStr.includes('天'))) {
      return timeStr;
    }

    try {
      const date = new Date(timeStr);
      const now = new Date();

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return timeStr;
      }

      // 计算时间差（毫秒）
      const diff = now.getTime() - date.getTime();
      const diffSeconds = Math.floor(diff / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      // 如果是今天
      if (diffDays === 0) {
        if (diffMinutes < 1) {
          return '刚刚';
        } else if (diffMinutes < 60) {
          return `${diffMinutes}分钟前`;
        } else if (diffHours < 24) {
          return `${diffHours}小时前`;
        }
      }

      // 如果是昨天
      if (diffDays === 1) {
        return '昨天';
      }

      // 如果是2-7天前
      if (diffDays > 1 && diffDays <= 7) {
        return `${diffDays}天前`;
      }

      // 超过7天，显示具体日期
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      // 如果是今年，不显示年份
      const currentYear = now.getFullYear();
      if (year === currentYear) {
        return `${month}-${day}`;
      }

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('格式化时间失败:', error);
      return timeStr;
    }
  };

  const platformColor = PLATFORM_COLORS[news.source] || '#666666';

  const handleCardClick = () => {
    if (news.url) {
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className={`bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-gray-100 hover:border-blue-300 cursor-pointer group overflow-hidden relative ${
        compact ? 'rounded-xl' : ''
      }`}
    >
      {/* 左侧装饰条 */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${compact ? 'w-0.5' : 'w-1'} bg-gradient-to-b from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        <div className={`${compact ? 'flex gap-2' : 'flex gap-3'}`}>
          {/* 时间线（仅在实时模式显示） */}
          {showTimeline && (
            <div className="flex-shrink-0 w-12 flex flex-col items-center py-1">
              {/* 日期 */}
              <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-1">
                {formatPublishTime(news.publishTime)}
              </div>
              {/* 竖线 */}
              <div className="flex-1 w-0.5 bg-gradient-to-b from-blue-300 via-blue-200 to-transparent"></div>
            </div>
          )}

          {/* 内容区 */}
          <div className="flex-1 min-w-0">
            {/* 标题 */}
            <h2 className={`${compact ? 'text-sm font-medium' : 'text-base font-semibold'} text-gray-900 ${compact ? 'mb-1' : 'mb-2'} line-clamp-1 leading-snug group-hover:text-blue-600 transition-colors`}>
              {news.title}
            </h2>

            {/* 缩略图（只在非紧凑模式显示） */}
            {!compact && news.thumbnail && (
              <div className="relative w-full h-36 mb-3 rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={news.thumbnail}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* 图片遮罩层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}

            {/* 描述（只在非紧凑模式显示） */}
            {!compact && news.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                {news.description}
              </p>
            )}

            {/* 元信息行 */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {/* 发布时间 */}
              <span className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                <Clock className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                {formatPublishTime(news.publishTime)}
              </span>

              {/* 热度值 */}
              <div className="flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                <Flame className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                {formatHotScore(news.hotScore)}
              </div>

              {/* 收藏按钮（在收藏页面不显示） */}
              {showBookmark && !onRemove && (
                <button
                  onClick={handleBookmark}
                  className="p-1.5 hover:bg-blue-100 hover:shadow-sm rounded-lg transition-all duration-200 ml-1"
                  title={isBookmarked ? '取消收藏' : '收藏'}
                >
                  <Heart
                    className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-all duration-200 ${
                      isBookmarked ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-400 hover:text-blue-600'
                    }`}
                  />
                </button>
              )}

              {/* 分享按钮 */}
              <button
                onClick={handleShare}
                className="p-1.5 hover:bg-blue-100 hover:shadow-sm rounded-lg transition-all duration-200 ml-1"
                title="分享"
              >
                <Share2
                  className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-400 hover:text-blue-600 transition-all duration-200`}
                />
              </button>

              {/* 删除按钮（仅在收藏页面显示） */}
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(news.id);
                  }}
                  className="p-1.5 hover:bg-red-100 hover:shadow-sm rounded-lg transition-all duration-200 ml-1"
                >
                  <X className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gray-400 hover:text-red-500 transition-all duration-200`} />
                </button>
              )}

              {/* 跳转图标 */}
              <ExternalLink className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0 ml-1`} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
