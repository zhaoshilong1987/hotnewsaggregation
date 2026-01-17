'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadBookmarks = () => {
    // 从localStorage加载收藏数据
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [refreshKey]);

  // 当页面可见时刷新数据
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有收藏吗？')) {
      localStorage.removeItem('bookmarks');
      setBookmarks([]);
    }
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarks.filter(item => item.id !== id);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-lg font-semibold text-gray-900">我的收藏</span>
              </div>
            </div>

            {bookmarks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">清空</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="px-4 py-4">
        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">还没有收藏内容</p>
            <p className="text-sm text-gray-400 mb-4">点击新闻详情页的收藏按钮即可添加</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              去浏览热榜
            </Link>
          </div>
        ) : (
          <>
            {/* 统计信息 */}
            <div className="text-sm text-gray-600 mb-4 px-1">
              共 <span className="font-bold text-orange-500">{bookmarks.length}</span> 条收藏
            </div>

            {/* 收藏列表 */}
            <div className="space-y-3">
              {bookmarks.map((news, index) => (
                <div key={news.id} className="relative">
                  <NewsCard news={news} rank={index + 1} />
                  <button
                    onClick={() => handleRemoveBookmark(news.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* 加载更多提示 */}
            <div className="text-center py-6 text-gray-400 text-sm">
              - 已经到底了 -
            </div>
          </>
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
}
