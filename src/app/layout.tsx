import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'optional',
});

export const metadata: Metadata = {
  title: {
    default: '全网热点',
    template: '%s | 全网热点',
  },
  description:
    '聚合全网热点资讯，实时同步各大平台热门话题、新闻排行榜。一站式获取知乎、微博、今日头条、百度热搜等平台的热点内容。',
  keywords: [
    '热点',
    '资讯',
    '热榜',
    '新闻',
    '知乎',
    '微博',
    '今日头条',
    '百度热搜',
    '澎湃新闻',
    '财联社',
  ],
  authors: [{ name: '全网热点 Team' }],
  generator: '全网热点',
  openGraph: {
    title: '全网热点 - 全网热点聚合平台',
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
    title: '全网热点',
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
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
