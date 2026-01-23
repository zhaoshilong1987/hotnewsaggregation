'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PLATFORMS } from '@/types/news';
import { getMockNews, getRealtimeNews } from '@/data/mockData';
import NewsCard from '@/components/NewsCard';
import PlatformCard from '@/components/PlatformCard';
import PlatformEditor from '@/components/PlatformEditor';
import PlatformIcon from '@/components/PlatformIcon';
import PlatformSettings from '@/components/PlatformSettings';
import BackButtonHandler from '@/components/BackButtonHandler';
import { RefreshCw, Clock, Bookmark, User, Settings, Flame as AllIcon, Flame, AlertCircle, MessageSquare, Menu, Newspaper, Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type TabType = 'hot' | 'realtime' | 'following' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('hot');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [realtimeNews, setRealtimeNews] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [followingHotPlatforms, setFollowingHotPlatforms] = useState<string[]>([]);
  const [followingRealtimePlatforms, setFollowingRealtimePlatforms] = useState<string[]>([]);
  const [showPlatformEditor, setShowPlatformEditor] = useState(false);
  const [visiblePlatforms, setVisiblePlatforms] = useState<string[]>([]);
  const [hiddenPlatforms, setHiddenPlatforms] = useState<string[]>([]);
  const [platformsLoaded, setPlatformsLoaded] = useState(false);
  const [useRealApi, setUseRealApi] = useState(true);
  // 立即初始化 mock 数据，确保页面不显示"暂无数据"
  const [hotNews, setHotNews] = useState<any[]>(getMockNews('all')); // 强制使用 mock 数据
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(30); // 初始显示30条
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // 检测是否是移动端
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const platformScrollRef = useRef<HTMLDivElement>(null);
  const platformTouchStartX = useRef(0);

  // 检测是否是移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
                            activeTab === 'realtime' ? realtimeNews :
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
  }, [activeTab, displayCount, isLoadingMore, hotNews, realtimeNews, bookmarks]);

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

  // 加载关注平台
  useEffect(() => {
    // 读取热榜关注平台
    const savedHotFollowing = localStorage.getItem('followingHotPlatforms');
    if (savedHotFollowing) {
      try {
        setFollowingHotPlatforms(JSON.parse(savedHotFollowing));
      } catch (e) {
        console.error('Failed to parse following hot platforms:', e);
      }
    }

    // 读取实时关注平台
    const savedRealtimeFollowing = localStorage.getItem('followingRealtimePlatforms');
    if (savedRealtimeFollowing) {
      try {
        setFollowingRealtimePlatforms(JSON.parse(savedRealtimeFollowing));
      } catch (e) {
        console.error('Failed to parse following realtime platforms:', e);
      }
    }

    // 向后兼容：如果用户之前有旧的 followingPlatforms，复制到两个新状态
    const oldFollowing = localStorage.getItem('followingPlatforms');
    if (oldFollowing && !savedHotFollowing && !savedRealtimeFollowing) {
      try {
        const oldFollowingList = JSON.parse(oldFollowing);
        setFollowingHotPlatforms(oldFollowingList);
        setFollowingRealtimePlatforms(oldFollowingList);
      } catch (e) {
        console.error('Failed to migrate old following platforms:', e);
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
    if (activeTab === 'realtime' && platformsLoaded) {
      fetchRealtimeNews();
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

      // 创建超时控制器 - 前端 15 秒超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

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

    console.log('getNewsByPlatform - grouped data:', {
      visiblePlatforms,
      groupedKeys: Object.keys(grouped),
      groupedCounts: Object.fromEntries(
        Object.entries(grouped).map(([key, items]) => [key, items.length])
      ),
    });

    // 按平台标签顺序排序
    // 如果 visiblePlatforms 为空，使用所有平台作为默认值
    const platformsToSort = visiblePlatforms.length > 0
      ? visiblePlatforms
      : Object.keys(grouped);

    const sortedPlatforms = platformsToSort
      .filter(key => grouped[key] && grouped[key].length > 0)
      .map(key => ({
        platform: PLATFORMS.find(p => p.key === key),
        news: grouped[key],
      }))
      .filter(item => item.platform !== undefined);

    console.log('getNewsByPlatform - sorted platforms:', {
      totalCount: sortedPlatforms.length,
      platforms: sortedPlatforms.map(p => ({ name: p.platform?.name, newsCount: p.news.length })),
    });

    return sortedPlatforms;
  };

  const groupedNews = getNewsByPlatform();

  // 获取实时资讯按平台分组的数据（用于实时全部标签）
  const getRealtimeNewsByPlatform = () => {
    if (selectedPlatform !== 'all' || activeTab !== 'realtime') {
      return null;
    }

    // 按平台分组
    const grouped = realtimeNews.reduce((acc: Record<string, any[]>, item) => {
      const source = item.source;
      if (!acc[source]) {
        acc[source] = [];
      }
      acc[source].push(item);
      return acc;
    }, {});

    console.log('getRealtimeNewsByPlatform - grouped data:', {
      visiblePlatforms,
      groupedKeys: Object.keys(grouped),
      groupedCounts: Object.fromEntries(
        Object.entries(grouped).map(([key, items]) => [key, items.length])
      ),
    });

    // 按平台标签顺序排序
    // 如果 visiblePlatforms 为空，使用所有平台作为默认值
    const platformsToSort = visiblePlatforms.length > 0
      ? visiblePlatforms
      : Object.keys(grouped);

    const sortedPlatforms = platformsToSort
      .filter(key => grouped[key] && grouped[key].length > 0)
      .map(key => ({
        platform: PLATFORMS.find(p => p.key === key),
        news: grouped[key],
      }))
      .filter(item => item.platform !== undefined);

    console.log('getRealtimeNewsByPlatform - sorted platforms:', {
      totalCount: sortedPlatforms.length,
      platforms: sortedPlatforms.map(p => ({ name: p.platform?.name, newsCount: p.news.length })),
    });

    return sortedPlatforms;
  };

  const groupedRealtimeNews = getRealtimeNewsByPlatform();

  const fetchRealtimeNews = async () => {
    try {
      if (useRealApi) {
        const platform = selectedPlatform === 'all' ? 'all' : selectedPlatform;

        // 创建超时控制器 - 前端 15 秒超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch(`/api/news/${platform}?type=realtime`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setRealtimeNews(result.data || []);
              return;
            }
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId);

          // 如果是超时错误，继续使用 mock 数据
          if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
            console.warn(`Realtime news API 请求超时，使用 mock 数据: ${fetchError.message}`);
          }
          throw fetchError;
        }
      }

      // 降级到 mock 数据
      const newsData = getRealtimeNews(selectedPlatform, 20);
      setRealtimeNews(newsData);
    } catch (error) {
      console.error('获取实时资讯失败:', error);
      const newsData = getRealtimeNews(selectedPlatform, 20);
      setRealtimeNews(newsData);
    }
  };

  // 平台标签滑动处理
  const handlePlatformTouchStart = (e: React.TouchEvent) => {
    platformTouchStartX.current = e.touches[0].clientX;
  };

  const handlePlatformTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - platformTouchStartX.current;

    // 滑动阈值
    const threshold = 50;

    if (selectedPlatform !== 'all') {
      const currentIndex = visiblePlatforms.indexOf(selectedPlatform);

      if (diffX > threshold) {
        // 向右滑动，切换到上一个平台
        if (currentIndex > 0) {
          setSelectedPlatform(visiblePlatforms[currentIndex - 1]);
        } else {
          // 已经是第一个，切换到全部
          setSelectedPlatform('all');
        }
      } else if (diffX < -threshold) {
        // 向左滑动，切换到下一个平台
        if (currentIndex < visiblePlatforms.length - 1) {
          setSelectedPlatform(visiblePlatforms[currentIndex + 1]);
        }
      }
    } else {
      // 当前是全部，向右滑动无效，向左滑动切换到第一个平台
      if (diffX < -threshold && visiblePlatforms.length > 0) {
        setSelectedPlatform(visiblePlatforms[0]);
      }
    }
  };

  const newsList = activeTab === 'hot' ? hotNews :
                  activeTab === 'realtime' ? realtimeNews :
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
    } else if (activeTab === 'realtime') {
      await fetchRealtimeNews();
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRefreshing(false);
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

  const handleToggleFollow = (platformKey: string) => {
    // 根据当前标签页确定更新哪个关注列表
    const currentList = activeTab === 'hot' ? followingHotPlatforms : followingRealtimePlatforms;
    const isFollowing = currentList.includes(platformKey);
    let updated: string[];

    if (isFollowing) {
      updated = currentList.filter(p => p !== platformKey);
    } else {
      updated = [...currentList, platformKey];
    }

    // 根据标签页更新对应的状态
    if (activeTab === 'hot') {
      setFollowingHotPlatforms(updated);
      localStorage.setItem('followingHotPlatforms', JSON.stringify(updated));
    } else {
      setFollowingRealtimePlatforms(updated);
      localStorage.setItem('followingRealtimePlatforms', JSON.stringify(updated));
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
      {/* 后退键处理 */}
      <BackButtonHandler
        onBack={() => {
          // 如果平台编辑器打开，关闭编辑器
          if (showPlatformEditor) {
            setShowPlatformEditor(false);
            return true;
          }
          // 否则，返回 false 让应用退出
          return false;
        }}
      />

      {/* 平台标签栏 - 固定在顶部，适配状态栏（仅在非"我的"和"关注"界面显示） */}
      {activeTab !== 'profile' && activeTab !== 'following' && (
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-blue-600 shadow-md"
          style={{ paddingTop: 'max(0px, env(safe-area-inset-top) - 8px)' }}
        >
          <div
            ref={platformScrollRef}
            className="flex items-center gap-2 px-3 py-1.5"
            onTouchStart={handlePlatformTouchStart}
            onTouchEnd={handlePlatformTouchEnd}
          >
            {/* 全部按钮 */}
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                selectedPlatform === 'all'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <AllIcon className="w-4 h-4" />
              <span className="text-xs font-medium whitespace-nowrap">全部</span>
            </button>

            {/* 平台标签列表 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
              {visiblePlatforms.map((platformKey) => {
                const platform = PLATFORMS.find((p) => p.key === platformKey);
                if (!platform) return null;

                return (
                  <button
                    key={platformKey}
                    onClick={() => setSelectedPlatform(platformKey)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                      selectedPlatform === platformKey
                        ? 'bg-white text-blue-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <PlatformIcon platform={platformKey as any} size={16} />
                    <span className="text-xs font-medium whitespace-nowrap">{platform.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 网页端刷新按钮 - 仅在非移动端显示 */}
            {!isMobile && (
              <button
                onClick={() => {
                  if (!isRefreshing) {
                    handleRefresh();
                  }
                }}
                disabled={isRefreshing}
                className="flex-shrink-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* 首页设置按钮 */}
            <button
              onClick={() => setShowPlatformEditor(true)}
              className="flex-shrink-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
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
        className="min-h-screen overflow-y-auto scrollbar-auto-hide"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 下拉刷新指示器 */}
        {isPulling && pullDistance > 0 && (
          <div className="flex justify-center py-2" style={{ transform: `translateY(${pullDistance - 30}px)` }}>
            <RefreshCw className={`w-6 h-6 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </div>
        )}

        {/* 新闻列表 */}
        <div className={`px-4 space-y-3 ${activeTab !== 'profile' && activeTab !== 'following' ? 'pt-20' : 'py-3'}`}>
          {activeTab === 'following' ? (
            <div className="space-y-6">
              {/* 热榜关注 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold">热榜关注</h2>
                  </div>
                  <span className="text-sm text-gray-500">{followingHotPlatforms.length} 个平台</span>
                </div>

                {followingHotPlatforms.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                    <p className="text-sm text-gray-400">在热榜页面点击平台卡片右上角关注</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {followingHotPlatforms.map((platformKey) => {
                      const platform = PLATFORMS.find(p => p.key === platformKey);
                      if (!platform) return null;

                      return (
                        <div
                          key={platform.key}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <PlatformIcon platform={platform.key as any} size={24} />
                              <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                            </div>
                            <button
                              onClick={() => {
                                const updated = followingHotPlatforms.filter(p => p !== platform.key);
                                setFollowingHotPlatforms(updated);
                                localStorage.setItem('followingHotPlatforms', JSON.stringify(updated));
                              }}
                              className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">已关注热榜</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 实时关注 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold">实时关注</h2>
                  </div>
                  <span className="text-sm text-gray-500">{followingRealtimePlatforms.length} 个平台</span>
                </div>

                {followingRealtimePlatforms.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                    <p className="text-sm text-gray-400">在实时页面点击平台卡片右上角关注</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {followingRealtimePlatforms.map((platformKey) => {
                      const platform = PLATFORMS.find(p => p.key === platformKey);
                      if (!platform) return null;

                      return (
                        <div
                          key={platform.key}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <PlatformIcon platform={platform.key as any} size={24} />
                              <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                            </div>
                            <button
                              onClick={() => {
                                const updated = followingRealtimePlatforms.filter(p => p !== platform.key);
                                setFollowingRealtimePlatforms(updated);
                                localStorage.setItem('followingRealtimePlatforms', JSON.stringify(updated));
                              }}
                              className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">已关注实时</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 如果两个列表都为空，显示空状态 */}
              {followingHotPlatforms.length === 0 && followingRealtimePlatforms.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-600">还没有关注任何平台</h3>
                  <p className="text-sm text-gray-400">
                    在热榜或实时页面点击平台卡片右上角即可关注
                  </p>
                </div>
              )}
            </div>
          ) : activeTab === 'profile' ? (
            <div className="space-y-4">
              {/* 个人信息卡片 */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
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
                    <div className="text-2xl font-bold text-blue-600">{PLATFORMS.length}</div>
                    <div className="text-sm text-gray-500">支持平台</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{bookmarks.length}</div>
                    <div className="text-sm text-gray-500">收藏内容</div>
                  </div>
                </div>
              </div> */}

              {/* 我的收藏和消息 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h3 className="text-lg font-semibold p-4 pb-2">我的</h3>

                {/* 收藏 */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {/* TODO: 显示收藏列表 */}}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium">我的收藏</div>
                      <div className="text-sm text-gray-500">{bookmarks.length} 条收藏内容</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{bookmarks.length}</span>
                      <Bookmark className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>

                {/* 消息 */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {/* TODO: 显示消息列表 */}}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium">消息中心</div>
                      <div className="text-sm text-gray-500">暂无新消息</div>
                    </div>
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

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

                {/* 订制首页 */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => setShowPlatformEditor(true)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium">订制首页</div>
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
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-900">API 请求失败</div>
                      <div className="text-sm text-blue-700 mt-1">{loadingError}</div>
                      <div className="text-sm text-blue-600 mt-2">已自动切换到模拟数据</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无数据
            </div>
          ) : (groupedNews && groupedNews.length > 0) || (groupedRealtimeNews && groupedRealtimeNews.length > 0) ? (
            // 全部标签：显示平台卡片网格布局（响应式三列）
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(activeTab === 'hot' ? groupedNews : groupedRealtimeNews)?.map((item) => (
                <PlatformCard
                  key={item.platform!.key}
                  platform={item.platform!}
                  news={item.news}
                  type={activeTab === 'hot' ? 'hot' : 'realtime'}
                  isFollowing={
                    activeTab === 'hot'
                      ? followingHotPlatforms.includes(item.platform!.key)
                      : followingRealtimePlatforms.includes(item.platform!.key)
                  }
                  onToggleFollow={handleToggleFollow}
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
        <div className="mx-auto max-w-md flex items-center justify-around px-4 py-2">
          {[
            { key: 'hot' as TabType, label: '热榜', icon: Flame },
            { key: 'realtime' as TabType, label: '实时', icon: Newspaper },
            { key: 'following' as TabType, label: '关注', icon: Heart },
            { key: 'profile' as TabType, label: '我的', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all duration-300 relative group ${
                  isActive
                    ? 'text-blue-600 bg-gradient-to-t from-blue-50 to-transparent'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {/* 激活状态指示器 */}
                {isActive && (
                  <div className="absolute -top-0.5 w-8 h-1 bg-blue-600 rounded-full shadow-lg shadow-blue-600/50" />
                )}

                {/* 图标容器 */}
                <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                  <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'fill-blue-600 drop-shadow-md' : ''}`} />
                  {/* 激活状态的光晕效果 */}
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full animate-pulse" />
                  )}
                </div>

                {/* 标签文本 */}
                <span className="text-[10px] font-medium transition-all duration-300">
                  {tab.label}
                </span>
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
