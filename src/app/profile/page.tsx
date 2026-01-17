'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNavigation from '@/components/BottomNavigation';
import { Flame, User, Settings, History, Bookmark, ChevronRight, LogOut, Heart, Shield, HelpCircle, Bell } from 'lucide-react';

interface UserProfile {
  name: string;
  avatar: string;
  signature: string;
  email?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    name: '未登录',
    avatar: '👤',
    signature: '点击登录获取更多功能'
  });
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // 从localStorage加载数据
    const savedBookmarks = localStorage.getItem('bookmarks');
    const savedHistory = localStorage.getItem('browseHistory');
    const savedUser = localStorage.getItem('userProfile');

    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('确定要清空浏览历史吗？')) {
      localStorage.removeItem('browseHistory');
      setHistory([]);
    }
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      localStorage.removeItem('userProfile');
      setUser({
        name: '未登录',
        avatar: '👤',
        signature: '点击登录获取更多功能'
      });
    }
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  const menuItems = [
    { icon: Settings, label: '偏好设置', description: '自定义您的使用偏好' },
    { icon: Bell, label: '消息通知', description: '管理通知设置' },
    { icon: Shield, label: '隐私与安全', description: '账号安全设置' },
    { icon: HelpCircle, label: '帮助与反馈', description: '获取帮助或提交反馈' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">个人中心</h1>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="px-4 py-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{user.signature}</p>
              {user.email && (
                <p className="text-xs text-gray-600">{user.email}</p>
              )}
            </div>
          </div>

          {/* 统计数据 - 已隐藏 */}
          {/* <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{bookmarks.length}</div>
              <div className="text-xs text-gray-500 mt-1">收藏</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{history.length}</div>
              <div className="text-xs text-gray-500 mt-1">浏览</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-500 mt-1">消息</div>
            </div>
          </div> */}

          {/* 登录/退出按钮 */}
          <div className="mt-6">
            {user.name === '未登录' ? (
              <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium">
                立即登录
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            )}
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <Link
            href="/favorites"
            className="flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition-colors border-b border-gray-50"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">我的收藏</div>
              <div className="text-xs text-gray-500">{bookmarks.length} 条收藏内容</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">浏览历史</div>
              <div className="text-xs text-gray-500">{history.length} 条浏览记录</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* 设置菜单 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* 版本信息 */}
        <div className="text-center mt-6 text-xs text-gray-400">
          <p>热榜资讯APP v1.0.0</p>
          <p className="mt-1">© 2025 All Rights Reserved</p>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNavigation />
    </div>
  );
}
