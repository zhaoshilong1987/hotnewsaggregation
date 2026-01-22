# 📱 全网热点 - Android APK 构建

## 🚀 使用 GitHub Actions 自动构建（推荐）

### 1. 推送代码触发构建
```bash
git add .
git commit -m "update app"
git push origin main
```

### 2. 手动触发构建
- 进入 GitHub 仓库的 "Actions" 标签页
- 选择 "Build Android APK" 工作流
- 点击 "Run workflow" 按钮

### 3. 下载 APK
- 构建完成后，在 Actions 运行页面
- 滚动到 "Artifacts" 部分
- 下载 `app-release` 文件

## 🛠️ 本地构建 APK

### 前置要求
- Java 21 或更高版本
- Node.js 20+
- pnpm 9+
- Android SDK（可选，会自动下载）

### 构建步骤
```bash
# 1. 安装依赖
pnpm install

# 2. 构建 APK
pnpm build:apk
```

构建完成后，APK 文件位于：
```
android/app/build/outputs/apk/release/app-release.apk
```

### 安装到设备
```bash
# 确保已启用 USB 调试
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 📖 详细文档

完整的 GitHub Actions 构建指南，请查看：[docs/GITHUB_ACTIONS_BUILD.md](docs/GITHUB_ACTIONS_BUILD.md)

## 🔐 配置签名（发布到应用商店）

如果需要发布到 Google Play，需要配置签名密钥。详细步骤请查看：[docs/GITHUB_ACTIONS_BUILD.md](docs/GITHUB_ACTIONS_BUILD.md#配置应用签名可选)

## 🎯 快速发布到 Google Play

1. 创建 Git tag：
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. 等待 GitHub Actions 自动构建 AAB 文件

3. 下载 AAB 并上传到 [Google Play Console](https://play.google.com/console)
