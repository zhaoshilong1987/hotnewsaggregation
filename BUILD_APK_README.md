# Android APK 构建指南

## 问题说明

由于应用使用了大量客户端组件和 API 路由，在构建静态 APK 时需要注意：

1. **静态导出模式**：Capacitor 需要静态文件来打包 APK
2. **API 路由限制**：Next.js 静态导出模式下，API 路由无法正常工作
3. **数据源选择**：APK 应使用 mock 数据，而不是从 API 获取

## 构建 APK 步骤

### 1. 配置静态导出

修改 `next.config.ts`，添加 `output: 'export'`：

```typescript
const nextConfig: NextConfig = {
  output: 'export',  // 添加这一行
  // ... 其他配置
};
```

### 2. 临时移除 API 路由

```bash
mv src/app/api src/app/api_disabled
```

或者删除 API 目录（推荐）：
```bash
rm -rf src/app/api
```

### 3. 构建项目

```bash
pnpm run build
```

### 4. 同步到 Android

```bash
npx cap sync android
```

### 5. 构建 APK

```bash
cd android && ./gradlew assembleDebug
```

APK 文件位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 6. 恢复配置

构建完成后，恢复 `next.config.ts`（移除 `output: 'export'`）以便开发使用：

```typescript
const nextConfig: NextConfig = {
  // 移除 output: 'export'
  // ... 其他配置
};
```

## 注意事项

1. **API 数据**：APK 中无法使用 API 路由，应用会自动降级使用 mock 数据
2. **版本控制**：不要提交移除 `output: 'export'` 的 next.config.ts，每次构建 APK 时临时添加
3. **API 目录**：需要备份 `src/app/api` 目录，构建完成后恢复

## 自动化脚本

可以使用以下脚本简化构建流程：

```bash
#!/bin/bash

# 添加静态导出配置
sed -i '/output:/d' next.config.ts
sed -i '/const nextConfig/a\  output: "export",' next.config.ts

# 移动 API 目录
mv src/app/api src/app/api_disabled

# 构建项目
pnpm run build

# 同步到 Android
npx cap sync android

# 构建 APK
cd android && ./gradlew assembleDebug

# 恢复配置
cd ..
sed -i '/output:/d' next.config.ts
mv src/app/api_disabled src/app/api

echo "APK 构建完成: android/app/build/outputs/apk/debug/app-debug.apk"
```
