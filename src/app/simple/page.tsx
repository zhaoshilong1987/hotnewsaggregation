'use client';

import Link from 'next/link';
import { Flame, Zap, Clock, Shield } from 'lucide-react';

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <h1 className="text-xl font-bold text-gray-900">全网热点</h1>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            聚合全网热点资讯
          </h2>
          <p className="text-gray-600 text-lg">
            实时追踪各大平台热门话题
          </p>
        </div>

        {/* 特性卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-8 h-8 text-orange-500" />
              <h3 className="font-semibold text-lg">实时更新</h3>
            </div>
            <p className="text-gray-600 text-sm">
              自动获取各大平台最新热点
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <h3 className="font-semibold text-lg">快速加载</h3>
            </div>
            <p className="text-gray-600 text-sm">
              智能缓存机制，秒开页面
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-8 h-8 text-orange-500" />
              <h3 className="font-semibold text-lg">稳定可靠</h3>
            </div>
            <p className="text-gray-600 text-sm">
              超时保护，自动降级
            </p>
          </div>
        </div>

        {/* 示例内容 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-orange-50 border-b">
            <h3 className="font-semibold text-lg text-gray-900">
              热门平台
            </h3>
          </div>
          <div className="divide-y">
            {[
              { name: '知乎', icon: '📖', desc: '高质量问答社区' },
              { name: '微博', icon: '🔥', desc: '实时热搜榜' },
              { name: '哔哩哔哩', icon: '📺', desc: '热门视频榜' },
              { name: '今日头条', icon: '📰', desc: '新闻资讯' },
              { name: '虎扑', icon: '🏀', desc: '体育社区' },
            ].map((platform, index) => (
              <div key={index} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="text-2xl">{platform.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{platform.name}</div>
                  <div className="text-sm text-gray-500">{platform.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-orange-500 mt-0.5">⚡</div>
            <div>
              <p className="font-medium text-orange-900 mb-1">
                快速访问提示
              </p>
              <p className="text-sm text-orange-700">
                点击"返回首页"按钮，应用将自动加载数据。首次加载可能需要几秒钟，
                之后会使用缓存，加载速度会更快。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        <p>© 2024 全网热点 | 聚合全网热门资讯</p>
      </footer>
    </div>
  );
}
