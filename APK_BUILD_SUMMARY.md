# Android APK 构建总结

## 构建信息

- **应用名称**: 热榜资讯
- **包名**: com.rebang.news
- **版本**: 1.0 (versionCode: 1)
- **构建类型**: Debug
- **构建时间**: 2025-01-15
- **文件大小**: 4.5 MB (4,693,241 bytes)
- **最低 SDK**: API 24 (Android 7.0)
- **目标 SDK**: API 36 (Android 14)

## 构建环境

- **JDK**: OpenJDK 21.0.9
- **Gradle**: 8.14.3
- **Android SDK**: Platform 36, Build-Tools 35.0.0, 34.0.0
- **Capacitor**: 8.x

## APK 下载

### 下载链接（有效期 30 天）

```
https://coze-coding-project.tos.coze.site/coze_storage_7595211091886604297/rebang-news/app-debug_7bccdb95.apk?sign=1771002937-1e093ca4c4-0-87f285f22dcd96718176a74e82b1d5b72a27ec85f2a0bd9e673126bb6b56bf89
```

### 安装说明

1. 在 Android 设备上，允许安装未知来源的应用
2. 点击上述下载链接下载 APK
3. 下载完成后，打开 APK 文件进行安装
4. 安装完成后，即可使用热榜资讯应用

## 应用特性

- 聚合全网热点资讯
- 支持多平台热榜展示
- 实时资讯浏览
- 搜索功能
- 收藏功能
- 平台标签编辑
- 简约清爽的移动端设计
- 橙色主题色

## 技术栈

- **前端框架**: Next.js 16 + React 19
- **构建工具**: Capacitor 8
- **样式**: Tailwind CSS 4
- **UI 组件**: shadcn/ui
- **语言**: TypeScript 5

## 文件位置

- **本地路径**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **对象存储 Key**: `rebang-news/app-debug_7bccdb95.apk`

## 注意事项

- 此为 Debug 版本，仅用于测试
- 如需发布到应用商店，需要构建 Release 版本并配置签名
- Debug 版本可能包含调试信息，不建议用于生产环境
