import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hotnewsaggregation.news',
  appName: '全网热点',

  // 本地构建输出目录（Capacitor 在本地测试时使用）
  webDir: 'out',

  server: {
    // ⭐ 关键配置：指向 Vercel 部署地址
    // 部署后替换为你的实际域名
    url: 'https://hotnewsaggregation.vercel.app',

    // Android 配置
    androidScheme: 'https',    // Android 要求使用 https
    cleartext: true,           // 允许 http（仅开发用）

    // 允许导航到外部链接（注意：是 allowNavigation，不是 allowedNavigation）
    allowNavigation: [
      'https://https://hotnewsaggregation.vercel.app',
      'https://*.vercel.app',
      'https://news.quanyouhulian.com'
    ]
  },

  android: {
    allowMixedContent: true,          // 允许混合内容（http/https）
    captureInput: true,               // 捕获输入
    webContentsDebuggingEnabled: false, // 生产环境关闭调试
    minWebViewVersion: 1,             // Android 12+ 要求
    backgroundColor: '#F97316',       // 启动背景色
  },

  ios: {
    backgroundColor: '#F97316',       // 启动背景色
  },

  plugins: {
    // 禁用 CapacitorHttp，使用原生 fetch
    CapacitorHttp: {
      enabled: false
    },


