# Vercel + Capacitor WebView 部署方案

## 一、方案概述

### 核心优势
- ✅ **一次开发**：只用 Next.js，无需写原生代码
- ✅ **一次部署**：git push 即可触发自动部署
- ✅ **双端同步**：网页和 App 自动同步更新
- ✅ **完全免费**：Vercel 免费额度，Google Play $25 一次性
- ✅ **无需审核**：业务更新无需应用商店审核

### 核心架构
```
┌─────────────────────────────────────────────────────────┐
│                    用户设备                               │
├────────────────────┬────────────────────────────────────┤
│   手机 App         │          浏览器                      │
│   (Capacitor壳)    │      (直接访问)                     │
│                    │                                    │
│  ┌──────────────┐  │  ┌──────────────┐                  │
│  │  WebView     │  │  │  浏览器窗口  │                  │
│  └──────┬───────┘  │  └──────┬───────┘                  │
│         │           │         │                          │
└─────────┼───────────┴─────────┼──────────────────────────┘
          │                   │
          └─────────┬─────────┘
                    │ 加载
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel 托管（云服务器）                      │
├─────────────────────────────────────────────────────────┤
│  Next.js 应用                                            │
│  ├── React 组件（前端）                                  │
│  ├── API 路由（后端）                                    │
│  ├── 静态资源（图片、CSS）                               │
│  └── 所有业务逻辑                                        │
│                                                          │
│  部署流程：                                              │
│  git push → 自动构建 → CDN 分发 → 全球访问               │
└─────────────────────────────────────────────────────────┘
```

---

## 二、GitHub 认证配置

### 前置准备
- GitHub 账号
- 本地已安装 Git

### 方案 1：使用 Personal Access Token（推荐，最简单）

#### 步骤 1：创建 Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息：
   - **Note**：输入一个描述（如 "HotListNews"）
   - **Expiration**：选择有效期（建议 90 days 或 No expiration）
   - **Scopes**：勾选以下权限：
     - ✅ `repo`（完整仓库权限）
     - ✅ `workflow`（用于 GitHub Actions，可选）
4. 点击 **"Generate token"**
5. **⚠️ 重要：立即复制 token，只显示一次！**

#### 步骤 2：使用 Token 推送

```bash
# 方法 A：在 push 时输入 token
git push -u origin main
# Username: your_github_username
# Password: 粘贴你的 token（不是 GitHub 密码！）

# 方法 B：使用 credential helper 存储 token
git config --global credential.helper store
git push -u origin main
# 输入一次后，后续会自动使用
```

#### 步骤 3：验证成功

```bash
git push
# 应该成功推送，无需再次输入密码
```

#### 注意事项
- Token 过期后需要重新生成
- 妥善保管 token，不要泄露
- 如果团队协作，建议使用 GitHub Apps

---

### 方案 2：使用 SSH 密钥（更安全）

#### 步骤 1：生成 SSH 密钥

```bash
# 1. 生成密钥（使用邮箱）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 按提示操作：
# - Enter file in which to save the key: 直接回车（默认路径）
# - Enter passphrase: 直接回车（无需密码）或输入密码
# - Enter same passphrase again: 重复输入
```

#### 步骤 2：查看公钥

```bash
# 查看公钥内容
cat ~/.ssh/id_ed25519.pub
```

输出示例：
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICexampleemail@example.com
```

#### 步骤 3：添加到 GitHub

1. 访问：https://github.com/settings/ssh
2. 点击 **"New SSH key"**
3. **Title**：输入描述（如 "My Computer"）
4. **Key**：粘贴刚才复制的公钥内容（从 `ssh-ed25519` 开始）
5. 点击 **"Add SSH key"**

#### 步骤 4：验证 SSH 连接

```bash
ssh -T git@github.com
```

成功输出：
```
Hi your_username! You've successfully authenticated, but GitHub does not provide shell access.
```

#### 步骤 5：切换 Git 远程地址为 SSH

```bash
# 1. 查看当前远程地址
git remote -v

# 2. 删除现有的 HTTPS 远程地址
git remote remove origin

# 3. 添加 SSH 地址
git remote add origin git@github.com:your_username/your_repo.git

# 4. 推送代码
git push -u origin main
```

#### 步骤 6：配置 SSH 自动添加密钥

```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加私钥
ssh-add ~/.ssh/id_ed25519
```

#### 注意事项
- 私钥文件不要泄露
- 密钥丢失需要重新生成
- 多台设备需要配置多个密钥

---

### 方案对比

| 方案 | 优点 | 缺点 | 推荐场景 |
|------|------|------|----------|
| **Personal Access Token** | 设置快速，兼容性好 | Token 过期需更新 | 临时使用、团队协作 |
| **SSH 密钥** | 更安全，无需输入密码 | 首次配置复杂 | 个人开发、长期使用 |

---

### 常见问题

#### Q1: Token 过期了怎么办？
**A:** 重新生成 Token，重复方案 1 的步骤。

#### Q2: 如何让 token 永不过期？
**A:** 在创建 token 时选择 **"No expiration"**。

#### Q3: 如何查看已保存的 token？
**A:**
```bash
# Windows
git config --global credential.helper manager-core
# 在 Windows Credential Manager 中查看

# macOS/Linux
cat ~/.git-credentials
```

#### Q4: Push 时仍然提示认证失败？
**A:** 检查以下几点：
- Token 是否已过期
- Token 是否有 `repo` 权限
- 用户名是否正确（应该是你的 GitHub 用户名）

#### Q5: SSH 提示 "Permission denied"？
**A:**
```bash
# 1. 检查 SSH 配置
ssh -vT git@github.com

# 2. 确认私钥存在
ls -la ~/.ssh/

# 3. 添加密钥到 ssh-agent
ssh-add ~/.ssh/id_ed25519
```

---

## 三、Vercel 部署步骤

### 步骤 1：准备代码并推送到 GitHub

```bash
# 1. 初始化 Git 仓库（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit"

# 4. 添加远程仓库
git remote add origin https://github.com/your_username/your_repo.git
# 或使用 SSH
git remote add origin git@github.com:your_username/your_repo.git

# 5. 推送代码
git push -u origin main
```

### 步骤 2：在 Vercel 创建项目

**方法 1：通过网页界面（推荐）**

1. 访问 https://vercel.com
2. 点击 **"Add New Project"**
3. 选择 **"Continue with GitHub"** 授权
4. 选择你的仓库
5. 配置项目设置：

```yaml
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm run build
Output Directory: 
Install Command: pnpm install
Node.js Version: 18.x
```

6. 点击 **"Deploy"**
7. 等待 2-3 分钟，部署成功

**方法 2：通过 CLI（可选）**

```bash
# 安装 Vercel CLI
pnpm add -D vercel

# 登录
npx vercel login

# 部署
npx vercel
```

### 步骤 3：获取部署域名

部署成功后，Vercel 会提供：
- **生产域名：** `https://your-app.vercel.app`
- **预览域名：** `https://your-app-git-xxx.vercel.app`

**记录你的生产域名，后续需要用到。**

### 步骤 4：配置环境变量（可选）

如果项目需要环境变量：

1. 进入 Vercel 项目设置
2. 选择 **"Environment Variables"**
3. 添加变量：
   ```bash
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```
4. 保存并重新部署

---

## 四、Capacitor WebView 配置

### 步骤 1：修改 capacitor.config.ts

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rebang.news',
  appName: '热榜资讯',

  // 本地构建输出目录（Capacitor 在本地测试时使用）
  webDir: 'out',

  server: {
    // ⭐ 关键配置：指向 Vercel 部署地址
    // 部署后替换为你的实际域名
    url: 'https://your-app.vercel.app',

    // 开发环境：本地测试时使用
    // url: 'http://localhost:5000',

    // Android 配置
    androidScheme: 'https',    // Android 要求使用 https
    cleartext: true,           // 允许 http（仅开发用）

    // 允许导航到外部链接
    allowNavigation: [
      'https://your-app.vercel.app',
      'https://*.vercel.app'
    ],

    // 允许加载的域名（CORS）
    allowedNavigation: [
      'https://your-app.vercel.app',
      'https://*.vercel.app',
      'https://news.quanyouhulian.com'
    ]
  },

  android: {
    allowMixedContent: true,          // 允许混合内容（http/https）
    captureInput: true,               // 捕获输入
    webContentsDebuggingEnabled: false, // 生产环境关闭调试
    minWebViewVersion: 1,             // Android 12+ 要求
    keepRunning: true,                // 防止全屏时被杀
    backgroundColor: '#F97316',       // 启动背景色

    // Android 清单配置
    manifest: {
      // 防止在 Chrome 中打开链接
      chromeKeepAlive: true
    }
  },

  ios: {
    contentInsetAdjustmentBehavior: 'automatic', // 自动调整内边距
    scrollEnabled: false,             // 禁用滚动
    backgroundColor: '#F97316',       // 启动背景色

    // iOS 配置
    handleRunningApps: false,         // 不处理运行中的应用
    hidesNavigationBar: false         // 显示导航栏
  },

  plugins: {
    // 禁用 CapacitorHttp，使用原生 fetch
    CapacitorHttp: {
      enabled: false
    },

    // 状态栏样式
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#F97316'
    },

    // 启动屏配置
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#F97316',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#F97316'
    },

    // App 配置
    App: {
      themeColor: '#F97316',
      // 允许复制到剪贴板
      copy: {
        enabled: true
      }
    }
  }
};

export default config;
```

### 步骤 2：同步到原生项目

```bash
# 1. 确保 webDir 正确（Next.js 输出目录）
# 检查 package.json 中的 build 脚本

# 2. 同步配置到 Android
npx cap sync android

# 3. 同步配置到 iOS
npx cap sync ios

# 4. 如果需要，添加 Android 平台（首次）
npx cap add android

# 5. 如果需要，添加 iOS 平台（首次）
npx cap add ios
```

### 步骤 3：本地测试远程加载

```bash
# 1. 打开 Android Studio
npx cap open android

# 2. 在 Android Studio 中：
# - 选择模拟器或真机
# - 点击运行按钮（绿色三角形）

# 3. App 启动后会自动加载 Vercel 地址
# 你应该看到与浏览器中相同的内容
```

**验证成功的标志：**
- ✅ App 正常加载 Vercel 网页
- ✅ 功能与浏览器一致
- ✅ API 请求正常

---

## 五、App 打包步骤

### 5.1 Android 打包

#### 步骤 1：准备签名密钥

```bash
# 1. 生成签名密钥（首次）
cd android/app
keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000

# 2. 记录密码和别名
# keystore password: xxx
# key alias: release
# key password: xxx
```

#### 步骤 2：配置签名

在 `android/app/build.gradle` 中添加：

```gradle
android {
    // ... 其他配置

    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword '你的密钥库密码'
            keyAlias 'release'
            keyPassword '你的密钥密码'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true  // 启用代码混淆
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        debug {
            signingConfig signingConfigs.release  // Debug 版本也使用正式签名（可选）
        }
    }
}
```

#### 步骤 3：构建 Release APK/AAB

```bash
# 1. 进入 Android 项目目录
cd android

# 2. 清理之前的构建
./gradlew clean

# 3. 构建 APK（用于直接安装）
./gradlew assembleRelease

# APK 位置：
# android/app/build/outputs/apk/release/app-release.apk

# 4. 构建 AAB（用于 Google Play）
./gradlew bundleRelease

# AAB 位置：
# android/app/build/outputs/bundle/release/app-release.aab
```

#### 步骤 4：测试 APK

```bash
# 在连接的 Android 设备上安装
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### 5.2 iOS 打包

#### 步骤 1：配置证书和描述文件

1. 访问 [Apple Developer](https://developer.apple.com)
2. 创建 App ID：`com.rebang.news`
3. 创建 Distribution 证书
4. 创建 Provisioning Profile

#### 步骤 2：打开 Xcode 项目

```bash
# 打开 Xcode
npx cap open ios
```

#### 步骤 3：配置 Xcode

1. 选择项目 → 选择 Target
2. **Signing & Capabilities**：
   - Team：选择你的开发者账号
   - Provisioning Profile：选择刚才创建的
3. **General**：
   - Bundle Identifier: `com.rebang.news`
   - Version: `1.0`
   - Build: `1`

#### 步骤 4：构建和归档

```bash
# 在 Xcode 中：
# 1. 选择 Any iOS Device
# 2. Product → Archive
# 3. 等待归档完成
# 4. 导出 IPA（Distribute App）
```

---

## 六、发布到应用商店

### 6.1 Google Play

1. 访问 [Google Play Console](https://play.google.com/console)
2. 创建新应用
3. 填写应用信息：
   - 应用名称：热榜资讯
   - 简短描述：聚合全网热点资讯
   - 完整描述：详细说明
   - 应用图标：512x512 PNG
   - 应用截图：至少 2 张
4. 上传 AAB 文件
5. 选择内容分级
6. 填写定价和分发范围
7. 提交审核

**审核时间：** 1-3 天

### 6.2 App Store

1. 访问 [App Store Connect](https://appstoreconnect.apple.com)
2. 创建新 App
3. 填写应用信息：
   - 名称：热榜资讯
   - 副标题：聚合全网热点
   - 类别：新闻
   - 描述：详细说明
4. 上传 IPA（使用 Transporter）
5. 添加截图和预览
6. 填写分级
7. 提交审核

**审核时间：** 1-5 天

---

## 七、同步更新机制详解

### 7.1 更新流程

```
┌─────────────────────────────────────────────────────────┐
│                    开发者操作                             │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│  修改代码（如修复 Bug、添加功能）                          │
│  - 修改 src/app/page.tsx                                  │
│  - 测试功能                                               │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│  Git 提交                                                 │
│  git add . && git commit && git push                    │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│  Vercel 自动检测更新                                       │
│  - Webhook 触发构建                                       │
│  - 运行 pnpm run build                                   │
│  - 生成 out/ 目录                                         │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│  Vercel 部署                                             │
│  - 构建成功                                               │
│  - 上传到 CDN                                             │
│  - 更新全局节点                                           │
└─────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│  用户访问                                                 │
│  - 打开浏览器                                             │
│  - 打开 App                                               │
│  - WebView 加载最新版本                                    │
└─────────────────────────────────────────────────────────┘
```

### 7.2 实际操作示例

**场景：修改首页标题**

```bash
# 1. 修改代码
vim src/app/page.tsx
# 将"热榜资讯"改为"全网热榜"

# 2. 本地测试
pnpm dev
# 浏览器打开 http://localhost:5000 验证

# 3. 提交代码
git add .
git commit -m "feat: 修改首页标题为全网热榜"
git push origin main

# 4. 等待 Vercel 部署（约 2 分钟）
# 在 Vercel 控制台可以看到构建日志

# 5. 部署完成后
# - 浏览器访问 https://your-app.vercel.app 立即看到更新
# - App 用户下次打开时自动看到更新
# - 无需更新 App，无需审核

# 总耗时：约 5 分钟
```

### 7.3 版本控制策略

**网页版本号（推荐）：**

```typescript
// src/lib/version.ts
export const APP_VERSION = {
  major: 1,
  minor: 0,
  patch: 1,
  build: Date.now(),
};

export const getVersionString = () => {
  return `${APP_VERSION.major}.${APP_VERSION.minor}.${APP_VERSION.patch}`;
};
```

**在首页显示版本：**

```typescript
// src/app/page.tsx
import { getVersionString } from '@/lib/version';

// 显示当前版本
<p>版本: {getVersionString()}</p>
```

**Git Tag 管理：**

```bash
# 发布新版本
git tag -a v1.0.1 -m "修复 Bug：API 解析问题"
git push origin v1.0.1
```

---

## 八、缓存管理（关键）

### 8.1 问题：用户看到旧版本

**原因：**
- WebView 缓存了旧版网页
- CDN 缓存了旧版资源

### 8.2 解决方案

#### 方案 1：强制刷新（推荐）

在 `src/app/layout.tsx` 中添加：

```typescript
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 每次页面加载时清除缓存
    const clearCache = async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    };

    clearCache();
  }, []);

  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 方案 2：添加版本查询参数

修改 `capacitor.config.ts`：

```typescript
const config: CapacitorConfig = {
  server: {
    // 添加版本号作为查询参数，强制刷新
    url: `https://your-app.vercel.app?v=${Date.now()}`,
  }
};
```

**注意：** 这种方式会每次都刷新，不建议在生产环境使用。

#### 方案 3：配置 Vercel 缓存策略

创建 `public/_headers` 文件：

```http
# HTML 文件：不缓存
/*
  Cache-Control: public, max-age=0, must-revalidate

# API 路由：短时间缓存
/api/*
  Cache-Control: public, max-age=60, s-maxage=60, stale-while-revalidate=120

# 静态资源：长时间缓存
/static/* /_next/static/* /images/*
  Cache-Control: public, max-age=31536000, immutable

# 构建产物：中等时间缓存
/_next/*
  Cache-Control: public, max-age=3600, s-maxage=3600
```

创建 `public/_redirects` 文件：

```http
# 强制使用 HTTPS
https://your-app.vercel.app/* https://your-app.vercel.app/:splat 301

# SPA 路由支持
/* /index.html 200
```

---

## 九、监控和调试

### 9.1 Vercel Analytics

```bash
# 安装
pnpm add @vercel/analytics

# 在 src/app/layout.tsx 中添加
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 9.2 远程调试

```typescript
// capacitor.config.ts（开发模式）
android: {
  webContentsDebuggingEnabled: true  // 允许 Chrome DevTools
}
```

使用 Chrome 调试：

```bash
# 1. 手机开启 USB 调试
# 2. 连接电脑
# 3. Chrome 访问 chrome://inspect
# 4. 点击你的 App
# 5. 打开 DevTools 查看控制台和网络
```

### 9.3 错误监控（可选）

集成 Sentry：

```bash
pnpm add @sentry/nextjs
pnpm dlx @sentry/wizard -i nextjs
```

---

## 十、常见问题解决

### Q1: App 显示白屏或加载失败

**原因：** 网络问题或地址错误

**解决：**
```bash
# 1. 检查 capacitor.config.ts 中的 url 是否正确
# 2. 确认 Vercel 部署成功
# 3. 浏览器访问 https://your-app.vercel.app 验证
# 4. 检查网络连接
```

### Q2: API 请求失败

**原因：** CORS 问题

**解决：**
```typescript
// 使用 Next.js API 路由作为代理
// src/app/api/proxy/[...path]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const response = await fetch(`https://news.quanyouhulian.com/${path.join('/')}`);
  return response;
}

// 前端调用
const data = await fetch('/api/proxy/api/s?id=zhihu&latest');
```

### Q3: 更新后用户仍然看到旧版本

**原因：** 缓存问题

**解决：**
```bash
# 1. 在 Vercel 控制台点击 "Redeploy"
# 2. 或者修改代码强制刷新（见八、缓存管理）
# 3. 用户清除 App 缓存：设置 → 应用 → 热榜资讯 → 清除缓存
```

### Q4: 如何实现离线访问？

**添加 PWA 支持：**

```bash
pnpm add next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js 配置
});
```

### Q5: 如何添加推送通知？

使用 Capacitor Push Notifications：

```bash
pnpm add @capacitor/push-notifications
npx cap sync
```

**注意：** 推送通知需要配置 FCM/APNs，可能需要重新审核 App。

---

## 十一、成本总结

| 项目 | 费用 | 说明 |
|------|------|------|
| **Vercel 部署** | **$0** | 100GB 带宽/月，无限部署 |
| **域名（可选）** | $10/年 | 使用 Vercel 免费域名可省略 |
| **Google Play 账号** | $25（一次性） | 必需 |
| **Apple Developer 账号** | $99/年 | 可选，如不需 iOS 发布 |
| **总成本** | **$25-$135/年** | 大部分功能完全免费 |

---

## 十二、完整工作流总结

### 首次部署（约 1 周）

```bash
# Day 1-2: 准备工作
- 注册 GitHub、Vercel 账号
- 推送代码到 GitHub
- 在 Vercel 创建项目

# Day 3-4: 部署和测试
- 修改 capacitor.config.ts 指向 Vercel
- 本地测试 WebView 加载
- 修复问题

# Day 5: 打包测试
- 打包 APK
- 在真机测试

# Day 6-7: 发布应用商店
- 提交 Google Play
- 提交 App Store（可选）
```

### 日常更新（约 5 分钟）

```bash
# 1. 修改代码
vim src/app/page.tsx

# 2. 本地测试
pnpm dev

# 3. 提交代码
git add .
git commit -m "feat: 添加新功能"
git push origin main

# 4. Vercel 自动部署（约 2 分钟）

# 5. 用户自动获取更新（无需任何操作）
```

### 版本发布（可选，约 10 分钟）

```bash
# 创建版本标签
git tag -a v1.0.1 -m "发布 v1.0.1"
git push origin v1.0.1

# Vercel 自动创建预览链接
# 在 GitHub Release 中查看
```

---

## 十三、推荐工具和资源

### 开发工具
- **VS Code**：代码编辑
- **Android Studio**：Android 开发
- **Xcode**：iOS 开发
- **Chrome DevTools**：调试 WebView

### 监控工具
- **Vercel Analytics**：用户统计
- **Sentry**：错误监控（可选）

### 文档资源
- [Vercel 文档](https://vercel.com/docs)
- [Capacitor 文档](https://capacitorjs.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [GitHub SSH 文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)

---

## 十四、快速参考

### 常用命令

```bash
# Git
git add .
git commit -m "feat: xxx"
git push origin main

# Vercel
npx vercel login
npx vercel

# Capacitor
npx cap sync android
npx cap sync ios
npx cap open android
npx cap open ios

# Android 构建
cd android
./gradlew clean
./gradlew assembleRelease
./gradlew bundleRelease
```

### 重要文件

```bash
# 配置文件
capacitor.config.ts      # Capacitor 配置
package.json            # 项目依赖
next.config.js          # Next.js 配置

# Vercel 配置
public/_headers         # 缓存策略
public/_redirects       # 路由重定向
.vercelignore           # 忽略文件

# 签名文件（不要提交）
android/app/release.keystore  # Android 签名
```

### 检查清单

部署前检查：
- [ ] 代码已推送到 GitHub
- [ ] `capacitor.config.ts` 中的 url 正确
- [ ] 本地测试通过
- [ ] 环境变量已配置（如有）
- [ ] 签名文件已准备

发布前检查：
- [ ] APK/AAB 构建成功
- [ ] 应用图标已准备
- [ ] 应用截图已准备
- [ ] 描述文本已准备
- [ ] 隐私政策已准备

---

## 总结

这个方案可以实现：
- ✅ **一次开发**：只用 Next.js
- ✅ **一次部署**：git push 即可
- ✅ **双端同步**：网页和 App 自动同步
- ✅ **完全免费**：Vercel 免费，Google Play $25 一次性
- ✅ **无需审核**：业务更新无需应用商店审核

通过合理配置 GitHub 认证、Vercel 部署和 Capacitor WebView，可以快速实现跨平台应用的开发和发布，大大降低开发和维护成本。
