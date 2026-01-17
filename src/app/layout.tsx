import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: '热榜资讯APP',
    template: '%s | 热榜资讯APP',
  },
  description:
    '聚合全网热点资讯，实时同步各大平台热门话题、新闻排行榜。一站式获取知乎、微博、今日头条、百度热搜等平台的热点内容。',
  keywords: [
    '热榜',
    '资讯',
    '热点',
    '新闻',
    '知乎',
    '微博',
    '今日头条',
    '百度热搜',
    '澎湃新闻',
    '财联社',
  ],
  authors: [{ name: '热榜资讯APP Team' }],
  generator: '热榜资讯APP',
  openGraph: {
    title: '热榜资讯APP - 全网热点聚合平台',
    description: '实时同步各大平台热门话题，一站式获取全网热点资讯',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '热榜资讯APP',
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'x-ua-compatible': 'ie=edge',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F97316',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
