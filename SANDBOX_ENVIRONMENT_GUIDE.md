# 沙盒环境开发指南

本文档说明如何在沙盒环境（Coze Coding）和本地环境之间协作开发 Android 应用。

## 环境概述

### 沙盒环境（Coze Coding）

**适用场景**：
- ✅ Web 功能开发和预览
- ✅ Next.js 应用构建
- ✅ 静态文件导出
- ✅ UI/UX 开发和测试
- ✅ API 开发和测试

**限制**：
- ❌ 无法执行 Android 构建
- ❌ 无法使用 `keytool` 生成签名密钥
- ❌ 无法运行 Android 模拟器
- ❌ 无法生成 APK/AAB 文件
- ❌ 没有 Java JDK 和 Android SDK

**端口**：
- 开发环境：5000
- 支持热更新（HMR）

### 本地环境

**适用场景**：
- ✅ Android APK/AAB 构建
- ✅ 生成签名密钥
- ✅ 真机/模拟器测试
- ✅ 上架应用商店

**必需工具**：
- Java JDK (17 或更高)
- Android SDK
- Android Studio（可选）

---

## 开发工作流

### 方案 1：沙盒开发 + 本地打包（推荐）

这是最推荐的工作流，充分利用两个环境的优势。

#### 步骤 1：在沙盒环境开发 Web 功能

```bash
# 在沙盒环境中
# 1. 开发和调试应用
# 2. 实时预览（5000 端口）
# 3. 测试 Web 功能
```

#### 步骤 2：在本地环境拉取代码

```bash
# 在本地环境
git clone <repository-url>
cd project

# 安装依赖
pnpm install
```

#### 步骤 3：构建静态文件

```bash
# 在本地环境
pnpm run build

# 或在沙盒环境构建，然后提交 out 目录
```

#### 步骤 4：同步到 Android

```bash
# 在本地环境
npx cap sync android
```

#### 步骤 5：生成签名密钥（首次）

```bash
# 在本地环境
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload

# 配置签名
# 编辑 android/keystore.properties
# 编辑 android/app/build.gradle
```

#### 步骤 6：构建 APK

```bash
# 在本地环境
cd android
./gradlew assembleDebug     # Debug 版本
./gradlew assembleRelease   # Release 版本
```

#### 步骤 7：测试和发布

```bash
# 安装到设备
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 或上传到应用商店
```

### 方案 2：全部在本地开发

如果你需要频繁测试 Android 功能，可以选择全部在本地开发。

```bash
# 1. 在本地克隆项目
git clone <repository-url>
cd project

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm run dev

# 4. 同步到 Android
npx cap sync android

# 5. 运行到设备
npx cap run android
```

---

## 文件同步策略

### 应在 Git 中跟踪的文件

```
项目根目录/
├── capacitor.config.ts          # ✅ 提交
├── next.config.ts               # ✅ 提交
├── package.json                 # ✅ 提交
├── src/                         # ✅ 提交
│   └── app/
└── android/                     # ✅ 提交
    ├── app/
    │   └── src/main/            # ✅ 提交
    ├── build.gradle             # ✅ 提交
    └── gradle.properties        # ✅ 提交
```

### 不应提交的文件（在 .gitignore 中）

```
# Android 构建产物
android/.gradle/
android/app/build/
android/build/
android/local.properties        # ❌ 不提交（本地配置）

# 签名密钥
*.jks                            # ❌ 不提交（敏感信息）
*.keystore                       # ❌ 不提交
android/keystore.properties      # ❌ 不提交（敏感信息）

# 密钥信息
upload-keystore.jks              # ❌ 不提交（敏感信息）
KEY_NOTES.txt                    # ❌ 不提交（敏感信息）
```

### 可选提交的文件

```
# Next.js 构建产物（如果需要快速部署）
out/                             # ⚠️ 可选（用于本地打包）
.next/                           # ⚠️ 可选（仅本地使用）
```

---

## 常见场景处理

### 场景 1：在沙盒环境开发了新功能，需要在 Android 上测试

**步骤**：

1. **在沙盒环境**：
   ```bash
   # 开发新功能
   # 测试 Web 版本
   # 提交代码
   git add .
   git commit -m "feat: 添加新功能"
   ```

2. **在本地环境**：
   ```bash
   # 拉取最新代码
   git pull

   # 构建静态文件
   pnpm run build

   # 同步到 Android
   npx cap sync android

   # 构建 Debug APK
   cd android
   ./gradlew assembleDebug

   # 安装到设备测试
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### 场景 2：需要在沙盒环境构建，然后在本地打包

**步骤**：

1. **在沙盒环境**：
   ```bash
   # 构建项目
   pnpm run build

   # 提交 out 目录
   git add out/
   git commit -m "build: 更新静态文件"
   ```

2. **在本地环境**：
   ```bash
   # 拉取最新代码（包含 out 目录）
   git pull

   # 直接同步到 Android（无需重新构建）
   npx cap sync android

   # 构建 APK
   cd android
   ./gradlew assembleRelease
   ```

⚠️ **注意**：out 目录较大，提交会增加仓库体积。建议仅在必要时提交。

### 场景 3：需要在本地环境生成签名密钥

**步骤**：

1. **在本地环境**：
   ```bash
   # 生成密钥库
   keytool -genkey -v -keystore upload-keystore.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias upload

   # 创建签名配置
   cat > android/keystore.properties << EOF
   storePassword=your_keystore_password
   keyPassword=your_key_password
   keyAlias=upload
   storeFile=../upload-keystore.jks
   EOF

   # 将这些文件添加到 .gitignore
   echo "upload-keystore.jks" >> .gitignore
   echo "android/keystore.properties" >> .gitignore
   ```

2. **保存密钥信息**（不要提交到 Git）：
   ```bash
   # 创建本地密钥笔记
   cat > ~/android-keys/project-keys.txt << EOF
   Keystore 文件: upload-keystore.jks
   Keystore password: [密码]
   Key password: [密码]
   Key alias: upload
   EOF
   ```

### 场景 4：团队协作，密钥管理

**方案 A：开发者各自维护密钥**

每个开发者生成自己的签名密钥，用于测试。

**方案 B：使用测试密钥（Debug 签名）**

开发阶段使用 Debug 签名，正式发布时由负责人使用正式密钥。

**方案 C：使用密钥管理服务**

- 使用 GitHub Actions Secrets
- 使用 AWS Secrets Manager
- 使用企业级密钥管理工具

---

## 快速参考

### 在沙盒环境可以做什么

```bash
# ✅ Web 开发
pnpm run dev

# ✅ 构建 Next.js 应用
pnpm run build

# ✅ 同步 Capacitor 配置
npx cap sync android

# ✅ 运行测试
pnpm test

# ✅ 代码检查
pnpm lint
```

### 在沙盒环境不能做什么

```bash
# ❌ 生成签名密钥
keytool -genkey ...  # 不支持

# ❌ 构建 APK
cd android && ./gradlew assembleDebug  # 不支持

# ❌ 运行 Android 模拟器
emulator -avd test  # 不支持

# ❌ 连接 ADB
adb devices  # 不支持
```

### 在本地环境必须做什么

```bash
# ✅ 生成签名密钥
keytool -genkey -v -keystore upload-keystore.jks -alias upload

# ✅ 构建 APK/AAB
cd android && ./gradlew assembleRelease
cd android && ./gradlew bundleRelease

# ✅ 测试 APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# ✅ 查看日志
adb logcat
```

---

## 最佳实践

### 1. 版本管理

- 在 `capacitor.config.ts` 和 `android/app/build.gradle` 中同步版本号
- 使用语义化版本（Semantic Versioning）
- 每次发布前更新版本号

### 2. 分支策略

```
main           # 生产环境，对应发布的版本
develop        # 开发环境，对应最新的开发版本
feature/*      # 功能分支
release/*      # 发布分支
```

### 3. CI/CD 集成

在 GitHub Actions 中自动构建 APK：

```yaml
name: Build Android APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install dependencies
        run: pnpm install

      - name: Build Next.js
        run: pnpm run build

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/*.apk
```

### 4. 安全建议

- ✅ 将密钥库文件添加到 `.gitignore`
- ✅ 使用强密码保护密钥库
- ✅ 定期备份密钥库文件
- ✅ 不要在公共代码仓库中泄露密钥信息
- ✅ 使用不同的密钥用于开发和生产环境

---

## 故障排查

### 问题 1：在本地执行 `npx cap sync android` 提示 out 目录不存在

**解决方案**：
```bash
# 在沙盒环境构建
pnpm run build

# 或在本地环境构建
pnpm run build

# 验证 out 目录存在
ls -la out
```

### 问题 2：在本地构建 APK 时提示找不到密钥文件

**解决方案**：
```bash
# 检查 keystore.properties 是否存在
cat android/keystore.properties

# 检查密钥文件路径是否正确
ls -la upload-keystore.jks

# 重新生成密钥（如果丢失）
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload
```

### 问题 3：沙盒环境和本地环境的构建结果不一致

**可能原因**：
- Node.js 版本不同
- 依赖版本不同
- 环境变量不同

**解决方案**：
```bash
# 统一 Node.js 版本
nvm use 18

# 锁定依赖版本
pnpm install --frozen-lockfile

# 清理缓存
rm -rf node_modules .next out
pnpm install
pnpm run build
```

---

## 相关文档

- [ANDROID_BUILD_STEPS.md](./ANDROID_BUILD_STEPS.md) - Android 打包完整步骤
- [Capacitor 官方文档](https://capacitorjs.com/docs/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

**最后更新**：2025-01-21
