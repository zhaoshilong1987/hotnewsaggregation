'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PLATFORMS } from '@/types/news';
import { getMockNews, getLatestNews } from '@/data/mockData';
import NewsCard from '@/components/NewsCard';
import PlatformCard from '@/components/PlatformCard';
import PlatformEditor from '@/components/PlatformEditor';
import PlatformIcon from '@/components/PlatformIcon';
import PlatformSettings from '@/components/PlatformSettings';
import { RefreshCw, Clock, Bookmark, User, Settings, Flame as AllIcon, Flame, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type TabType = 'hot' | 'latest' | 'favorites' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('hot');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [hotNews, setHotNews] = useState<any[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [showPlatformEditor, setShowPlatformEditor] = useState(false);
  const [visiblePlatforms, setVisiblePlatforms] = useState<string[]>([]);
  const [hiddenPlatforms, setHiddenPlatforms] = useState<string[]>([]);
  const [platformsLoaded, setPlatformsLoaded] = useState(false);
  const [useRealApi, setUseRealApi] = useState(false);
  // 立即初始化 mock 数据，确保页面不显示"暂无数据"
  const [hotNews, setHotNews] = useState<any[]>(getMockNews('all')); // 强制使用 mock 数据
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(30); // 初始显示30条
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 初始化平台配置
  useEffect(() => {
    console.log('初始化平台配置...');
    const loadPlatformConfig = async () => {
      try {
        // 从配置文件读取平台标签配置
        // 添加超时控制 - 延长到 15 秒超时，增加容错
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const tagsResponse = await fetch('/api/tags', {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (tagsResponse.ok) {
            const tagsResult = await tagsResponse.json();
            if (tagsResult.success) {
              setVisiblePlatforms(tagsResult.data.visible || []);
              setHiddenPlatforms(tagsResult.data.hidden || []);
            } else {
              console.error('加载平台标签配置失败:', tagsResult.error);
              // 使用默认配置 - 使用所有平台而不是只使用前8个
              const allPlatformKeys = PLATFORMS.map(p => p.key);
              setVisiblePlatforms(allPlatformKeys);
              setHiddenPlatforms([]);
            }
          } else {
            console.error('加载平台标签配置失败: HTTP', tagsResponse.status);
            // 使用默认配置 - 使用所有平台而不是只使用前8个
            const allPlatformKeys = PLATFORMS.map(p => p.key);
            setVisiblePlatforms(allPlatformKeys);
            setHiddenPlatforms([]);
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId);

          // 如果是超时错误，使用默认配置
          if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
            console.warn('平台配置 API 请求超时，使用默认配置（包含所有平台）');
          }

          // 使用默认配置 - 使用所有平台而不是只使用前8个
          const allPlatformKeys = PLATFORMS.map(p => p.key);
          setVisiblePlatforms(allPlatformKeys);
          setHiddenPlatforms([]);
        }

        // 读取 useRealApi 设置（从 localStorage 保持兼容）
        const savedUseRealApi = localStorage.getItem('useRealApi');
        if (savedUseRealApi !== null) {
          setUseRealApi(JSON.parse(savedUseRealApi));
        }

        // 确保无论如何都设置 platformsLoaded 为 true
        setPlatformsLoaded(true);
      } catch (e) {
        console.error('Failed to load platform configuration:', e);
        // 使用默认配置 - 使用所有平台而不是只使用前8个
        const allPlatformKeys = PLATFORMS.map(p => p.key);
        setVisiblePlatforms(allPlatformKeys);
        setHiddenPlatforms([]);
        // 确保无论如何都设置 platformsLoaded 为 true
        setPlatformsLoaded(true);
      }
    };

    loadPlatformConfig();
  }, []);

  // 重置显示数量当数据源改变时
  useEffect(() => {
    setDisplayCount(30);
  }, [activeTab, selectedPlatform]);

  // 无限滚动加载更多
  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          const currentList = activeTab === 'hot' ? hotNews :
                            activeTab === 'latest' ? latestNews :
                            bookmarks;

          // 如果还有更多数据未显示
          if (displayCount < currentList.length) {
            setIsLoadingMore(true);
            // 延迟一点以显示加载效果
            setTimeout(() => {
              setDisplayCount(prev => Math.min(prev + 30, currentList.length));
              setIsLoadingMore(false);
            }, 300);
          }
        }
      },
      {
        root: scrollRef.current,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (loadMoreRef.current) {
      loadMoreObserver.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        loadMoreObserver.unobserve(loadMoreRef.current);
      }
    };
  }, [activeTab, displayCount, isLoadingMore, hotNews, latestNews, bookmarks]);

  // 加载收藏
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }
  }, []);

  // 加载热榜数据
  useEffect(() => {
    if (activeTab === 'hot') {
      fetchHotNews();
    }
  }, [activeTab, selectedPlatform]);

  // 加载最新资讯
  useEffect(() => {
    if (activeTab === 'latest' && platformsLoaded) {
      fetchLatestNews();
    }
  }, [activeTab, selectedPlatform, platformsLoaded]);

  const fetchHotNews = async () => {
    console.log('fetchHotNews called:', {
      activeTab,
      selectedPlatform,
      platformsLoaded,
      useRealApi
    });
    try {
      setLoadingError(null);

      if (!useRealApi) {
        // 使用 mock 数据
        const newsData = getMockNews(selectedPlatform);
        console.log('Mock data loaded:', newsData.length);
        setHotNews(newsData);
        return;
      }

      // 使用真实 API
      const platform = selectedPlatform === 'all' ? 'all' : selectedPlatform;

      // 创建超时控制器 - 前端 10 秒超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`/api/news/${platform}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setHotNews(result.data || []);
        } else {
          throw new Error(result.error || '获取数据失败');
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);

        // 如果是超时错误，立即降级到 mock 数据
        if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
          console.warn(`API 请求超时，降级到 mock 数据: ${fetchError.message}`);
          setLoadingError('API 响应超时，已切换到模拟数据');
          const newsData = getMockNews(selectedPlatform);
          setHotNews(newsData);
          return;
        }

        throw fetchError;
      }
    } catch (error: any) {
      console.error('获取热榜数据失败:', error);
      setLoadingError(error.message || '获取数据失败');
      // 降级到 mock 数据
      const newsData = getMockNews(selectedPlatform);
      setHotNews(newsData);
    }
  };

  // 获取按平台分组的数据（用于全部标签）
  const getNewsByPlatform = () => {
    if (selectedPlatform !== 'all' || activeTab !== 'hot') {
      return null;
    }

    // 按平台分组
    const grouped = hotNews.reduce((acc: Record<string, any[]>, item) => {
      const source = item.source;
      if (!acc[source]) {
        acc[source] = [];
      }
      acc[source].push(item);
      return acc;
    }, {});

    // 按平台标签顺序排序
    const sortedPlatforms = visiblePlatforms
      .filter(key => grouped[key] && grouped[key].length > 0)
      .map(key => ({
        platform: PLATFORMS.find(p => p.key === key),
        news: grouped[key],
      }))
      .filter(item => item.platform !== undefined);

    return sortedPlatforms;
  };

  const groupedNews = getNewsByPlatform();

  const fetchLatestNews = async () => {
    try {
      if (useRealApi) {
        const platform = selectedPlatform === 'all' ? 'all' : selectedPlatform;

        // 创建超时控制器 - 前端 10 秒超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(`/api/news/${platform}`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setLatestNews(result.data || []);
              return;
            }
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId);

          // 如果是超时错误，继续使用 mock 数据
          if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
            console.warn(`Latest news API 请求超时，使用 mock 数据: ${fetchError.message}`);
          }
          throw fetchError;
        }
      }

      // 降级到 mock 数据
      const newsData = getLatestNews(selectedPlatform, 20);
      setLatestNews(newsData);
    } catch (error) {
      console.error('获取最新资讯失败:', error);
      const newsData = getLatestNews(selectedPlatform, 20);
      setLatestNews(newsData);
    }
  };

  const newsList = activeTab === 'hot' ? hotNews :
                  activeTab === 'latest' ? latestNews :
                  bookmarks;

  const currentPlatformInfo = selectedPlatform === 'all'
    ? { name: '全部', icon: '🔥', color: '#F97316' }
    : PLATFORMS.find(p => p.key === selectedPlatform) || PLATFORMS[0];

  // 下拉刷新逻辑
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;

    // 只允许向下拉动
    if (distance > 0) {
      const resistance = distance > 150 ? 150 : distance;
      setPullDistance(resistance);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80) {
      // 触发刷新
      await handleRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPullDistance(0);

    if (activeTab === 'hot') {
      await fetchHotNews();
    } else if (activeTab === 'latest') {
      await fetchLatestNews();
    } else if (activeTab === 'favorites') {
      const savedBookmarks = localStorage.getItem('bookmarks');
      if (savedBookmarks) {
        try {
          setBookmarks(JSON.parse(savedBookmarks));
        } catch (e) {
          console.error('Failed to parse bookmarks:', e);
        }
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRefreshing(false);
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarks.filter(item => item.id !== id);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const handleSavePlatforms = async (visible: string[], hidden: string[]) => {
    try {
      // 保存到配置文件
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible, hidden }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVisiblePlatforms(visible);
          setHiddenPlatforms(hidden);
          // 不再自动关闭编辑器，让用户继续调整
        } else {
          console.error('保存平台标签配置失败:', result.error);
        }
      } else {
        console.error('保存平台标签配置失败: HTTP', response.status);
      }
    } catch (error) {
      console.error('保存平台标签配置失败:', error);
    }
  };

  const getVisiblePlatformList = () => {
    // 如果 visiblePlatforms 为空，返回所有平台作为默认值
    const platformsToUse = visiblePlatforms.length > 0
      ? visiblePlatforms
      : PLATFORMS.map(p => p.key);
    const result = platformsToUse.map(key => PLATFORMS.find(p => p.key === key)).filter(Boolean);
    console.log('getVisiblePlatformList:', {
      visiblePlatforms,
      platformsToUse,
      resultCount: result.length
    });
    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 平台标签栏 - 固定在顶部，适配状态栏（仅在非"我的"界面显示） */}
      {activeTab !== 'profile' && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="px-4 py-2">
            <div className="flex items-center gap-2">
            {/* 平台标签 - 横向滚动 */}
            <div className="flex overflow-x-auto gap-2 py-1 px-1 flex-1 no-scrollbar items-center">
              {/* 全部平台 */}
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedPlatform === 'all'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AllIcon className="w-4 h-4" />
                全部
              </button>

              {/* 平台列表 */}
              {getVisiblePlatformList().map((platform: any) => (
                <button
                  key={platform.key}
                  onClick={() => setSelectedPlatform(platform.key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    selectedPlatform === platform.key
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PlatformIcon platform={platform.key} size={16} className={`flex-shrink-0 ${
                    selectedPlatform === platform.key ? 'text-white' : 'text-current'
                  }`} />
                  {platform.name}
                </button>
              ))}
            </div>

            {/* 刷新按钮 */}
            <button
              onClick={() => handleRefresh()}
              disabled={isRefreshing}
              className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* 平台编辑器 */}
      {showPlatformEditor && (
        <PlatformEditor
          visiblePlatforms={visiblePlatforms}
          hiddenPlatforms={hiddenPlatforms}
          onSave={handleSavePlatforms}
          onCancel={() => setShowPlatformEditor(false)}
        />
      )}

      {/* 主内容区 - 下拉刷新 */}
      <div
        ref={scrollRef}
        className="min-h-screen overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 下拉刷新指示器 */}
        {isPulling && pullDistance > 0 && (
          <div className="flex justify-center py-2" style={{ transform: `translateY(${pullDistance - 30}px)` }}>
            <RefreshCw className={`w-6 h-6 text-orange-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </div>
        )}

        {/* 新闻列表 */}
        <div className="px-4 py-3 space-y-3">
          {activeTab === 'profile' ? (
            <div className="space-y-4">
              {/* 个人信息卡片 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">全网热点</h2>
                    <p className="text-gray-500 text-sm">聚合全网热点资讯</p>
                  </div>
                </div>
              </div>

              {/* 数据统计 - 已隐藏 */}
              {/* <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">数据统计</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-500">{PLATFORMS.length}</div>
                    <div className="text-sm text-gray-500">支持平台</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-500">{bookmarks.length}</div>
                    <div className="text-sm text-gray-500">收藏内容</div>
                  </div>
                </div>
              </div> */}

              {/* 设置选项 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h3 className="text-lg font-semibold p-4 pb-2">设置</h3>

                {/* API 源设置 */}
                <div className="border-t border-gray-100">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">使用真实 API</div>
                      <div className="text-sm text-gray-500">从各平台获取真实热榜数据</div>
                    </div>
                    <Switch
                      checked={useRealApi}
                      onCheckedChange={(checked) => {
                        setUseRealApi(checked);
                        localStorage.setItem('useRealApi', JSON.stringify(checked));
                      }}
                    />
                  </div>
                </div>

                {/* 平台 API 配置 */}
                <div className="border-t border-gray-100">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">平台 API 配置</div>
                      <div className="text-sm text-gray-500">管理各平台的 API 地址</div>
                    </div>
                    <PlatformSettings />
                  </div>
                </div>

                {/* 平台标签管理 */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => setShowPlatformEditor(true)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium">平台标签管理</div>
                      <div className="text-sm text-gray-500">管理首页显示的平台标签</div>
                    </div>
                    <Settings className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 关于 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium">关于</div>
                    <span className="text-sm text-gray-400">v1.0.0</span>
                  </button>
                </div>
              </div>

              {/* 错误提示 */}
              {loadingError && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-orange-900">API 请求失败</div>
                      <div className="text-sm text-orange-700 mt-1">{loadingError}</div>
                      <div className="text-sm text-orange-600 mt-2">已自动切换到模拟数据</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {activeTab === 'favorites' ? '暂无收藏内容' : '暂无数据'}
            </div>
          ) : groupedNews && groupedNews.length > 0 ? (
            // 全部标签：显示平台卡片网格布局
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupedNews.map((item) => (
                <PlatformCard
                  key={item.platform!.key}
                  platform={item.platform!}
                  news={item.news}
                />
              ))}
            </div>
          ) : (
            // 其他标签：显示单列新闻列表
            <>
              {newsList.slice(0, displayCount).map((item: any) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  platform={currentPlatformInfo}
                  onRemove={activeTab === 'favorites' ? handleRemoveBookmark : undefined}
                />
              ))}

              {/* 加载更多指示器 */}
              {displayCount < newsList.length && (
                <div ref={loadMoreRef} className="text-center py-4">
                  {isLoadingMore ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="text-sm">加载中...</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      上滑加载更多 ({displayCount}/{newsList.length})
                    </div>
                  )}
                </div>
              )}

              {/* 显示全部数据的提示 */}
              {displayCount >= newsList.length && newsList.length > 30 && (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-400">
                    已加载全部 {newsList.length} 条内容
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { key: 'hot' as TabType, label: '热榜', icon: Flame },
            { key: 'favorites' as TabType, label: '收藏', icon: Bookmark },
            { key: 'profile' as TabType, label: '我的', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'text-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-6 h-6 ${activeTab === tab.key ? 'fill-orange-500' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
        {/* 安全区域适配 */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white" />
      </nav>
    </div>
  );
}
