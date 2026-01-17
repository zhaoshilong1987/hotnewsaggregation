'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchNews } from '@/data/mockData';
import NewsCard from '@/components/NewsCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Search, X, Flame, Clock, ArrowLeft, Filter, TrendingUp } from 'lucide-react';

const HOT_SEARCH_KEYWORDS = [
  { keyword: '人工智能', hot: true },
  { keyword: '新能源汽车', hot: true },
  { keyword: '科技新闻', hot: false },
  { keyword: '世界杯', hot: true },
  { keyword: '股市行情', hot: false },
  { keyword: '房价', hot: true },
  { keyword: '高考', hot: false },
  { keyword: '教育改革', hot: true },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // 从localStorage加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  // 保存搜索历史到localStorage
  const saveSearchHistory = (history: string[]) => {
    setSearchHistory(history);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // 更新搜索历史
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    saveSearchHistory(newHistory);

    setSearchQuery(query);
    setIsFocused(false);

    // 搜索新闻
    const results = searchNews(query).sort((a, b) => b.hotScore - a.hotScore);
    setSearchResults(results);
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空搜索历史吗？')) {
      saveSearchHistory([]);
    }
  };

  const handleHistoryClick = (keyword: string) => {
    handleSearch(keyword);
  };

  const handleHotSearchClick = (keyword: string) => {
    handleSearch(keyword);
  };

  const handleClearInput = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 搜索栏 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="搜索全网热点..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClearInput}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              搜索
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="px-4 py-4">
        {!searchQuery ? (
          <>
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">搜索历史</h3>
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    清空
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleHistoryClick(keyword)}
                      className="px-3 py-2 bg-white rounded-xl text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-sm"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Flame className="w-4 h-4 text-red-500" />
                <h3 className="font-semibold text-gray-900">热门搜索</h3>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {HOT_SEARCH_KEYWORDS.map((item, index) => (
                  <button
                    key={item.keyword}
                    onClick={() => handleHotSearchClick(item.keyword)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-orange-50 transition-colors text-left group border-b border-gray-50 last:border-0"
                  >
                    <span
                      className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-sm font-bold rounded-lg ${
                        index < 3 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                      {item.keyword}
                    </span>
                    {item.hot && (
                      <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        热门
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 搜索结果头部 */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="text-sm text-gray-600">
                找到 <span className="font-bold text-orange-500">{searchResults.length}</span> 条结果
              </div>
            </div>

            {/* 搜索结果列表 */}
            <div className="space-y-3">
              {searchResults.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">没有找到相关内容</p>
                  <p className="text-sm text-gray-400">试试其他关键词吧</p>
                </div>
              ) : (
                searchResults.map((news, index) => (
                  <NewsCard key={news.id} news={news} rank={index + 1} />
                ))
              )}
            </div>

            {/* 加载更多提示 */}
            {searchResults.length > 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                - 已经到底了 -
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
}
