'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import BottomNavigation from '@/components/BottomNavigation';
import { History, ArrowLeft, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // 从localStorage加载浏览历史
    const savedHistory = localStorage.getItem('browseHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const handleClearAll = () => {
    if (window.confirm('确定要清空浏览历史吗？')) {
      localStorage.removeItem('browseHistory');
      setHistory([]);
    }
  };

  const handleRemoveHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('browseHistory', JSON.stringify(updated));
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
                <History className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-semibold text-gray-900">浏览历史</span>
              </div>
            </div>

            {history.length > 0 && (
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
        {history.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">还没有浏览历史</p>
            <p className="text-sm text-gray-400 mb-4">浏览过的新闻会显示在这里</p>
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
              共 <span className="font-bold text-orange-500">{history.length}</span> 条浏览记录
            </div>

            {/* 历史列表 */}
            <div className="space-y-3">
              {history.map((news, index) => (
                <div key={news.id} className="relative">
                  <NewsCard news={news} rank={index + 1} />
                  <button
                    onClick={() => handleRemoveHistory(news.id)}
                    className="absolute top-4 right-4 p-2 bg-gray-400 text-white rounded-full hover:bg-red-500 transition-colors shadow-sm z-10"
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
