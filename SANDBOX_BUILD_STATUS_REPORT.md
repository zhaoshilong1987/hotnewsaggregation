# 沙盒环境 Android APK 构建状态报告

## 当前状态

❌ **构建失败**：由于 Capacitor Android 插件（版本 7.x）强制要求 Java 21，而沙盒环境只能安装 Java 17。

## 已完成的工作

### 1. 环境配置

✅ **Java JDK 17**
- 路径: `/usr/lib/jvm/java-17-openjdk-amd64`
- 版本: OpenJDK 17.0.17

✅ **Android SDK**
- 路径: `/opt/android-sdk`
- 已安装组件:
  - Platform Tools (36.0.2)
  - Android Platform 34
  - Build Tools 34.0.0

✅ **Gradle 8.14.3**
- 路径: `/root/.gradle/wrapper/dists/gradle-8.14.3-all/10utluxaxniiv4wxiphsi49nj/gradle-8.14.3`

### 2. 项目配置

✅ **Capacitor 7.x** 已安装
- 从 Capacitor 8.x 降级到 7.x
- 所有插件版本: 7.x

✅ **Android 平台** 已添加
- 项目已同步到 Android
- Web 资源已复制

### 3. 配置修改

修改了以下文件以支持 Java 17：

1. ✅ `android/app/capacitor.build.gradle`
2. ✅ `android/capacitor-cordova-android-plugins/build.gradle`
3. ✅ `android/build.gradle` (全局配置)

## 遇到的问题

### 核心问题

**错误信息：**
```
Execution failed for task ':capacitor-android:compileReleaseJavaWithJavac'.
> Java compilation initialization error
    error: invalid source release: 21
```

**根本原因：**
- `:capacitor-android` 是一个外部依赖模块（从 npm 包 `@capacitor/android` 下载）
- 该模块的构建配置硬编码了 Java 21
- 这个配置在 Gradle 缓存中，无法通过修改本地项目文件覆盖
- Java 17 无法编译需要 Java 21 语法的源代码

### 尝试过的解决方案

1. ❌ 修改本地 build.gradle 文件（无效，外部依赖优先级更高）
2. ❌ 全局配置 Java 版本（无效，模块级别配置覆盖全局配置）
3. ❌ 降级到 Capacitor 7.x（仍然需要 Java 21）
4. ❌ 安装 Java 21（下载链接 404，网络环境限制）

## 建议的解决方案

### 方案 1：安装 Java 21（推荐）

如果能在沙盒环境安装 Java 21：

```bash
# 尝试使用以下命令之一
apt install -y openjdk-21-jdk

# 或使用 SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 21.0.1-tem

# 设置环境变量
export JAVA_HOME=/path/to/java21

# 重新构建
cd /workspace/projects/android
./gradlew assembleRelease --no-daemon
```

### 方案 2：使用 CI/CD 服务

在 GitHub Actions 上构建：

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install

      - name: Build Next.js
        run: pnpm run build:vercel

      - name: Add Android platform
        run: npx cap add android

      - name: Sync to Android
        run: npx cap sync android

      - name: Build Release APK
        run: |
          cd android
          ./gradlew assembleRelease --no-daemon

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/app-release.apk
```

### 方案 3：在本地环境构建（Windows）

回到之前讨论的 Windows 本地环境：

1. 安装 Java JDK 21
2. 安装 Android Studio（包含 Android SDK）
3. 配置环境变量
4. 在本地执行构建命令

详细步骤请参考 `ANDROID_BUILD_STEPS.md` 文档。

## 环境变量配置

如果以后在沙盒环境构建成功，需要配置以下环境变量：

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64  # 或 Java 21 路径
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/34.0.0
```

## 构建命令

### Release APK（生产环境，未签名）

```bash
cd /workspace/projects/android
./gradlew assembleRelease --no-daemon
```

**输出位置：**
`android/app/build/outputs/apk/release/app-release.apk`

### Debug APK（测试环境）

```bash
cd /workspace/projects/android
./gradlew assembleDebug --no-daemon
```

**输出位置：**
`android/app/build/outputs/apk/debug/app-debug.apk`

## 文件清单

创建的文件：

1. `/workspace/projects/build-android-apk.sh` - 原始构建脚本
2. `/workspace/projects/build-apk-background.sh` - 后台构建脚本
3. `/workspace/projects/simple-build.sh` - 简化构建脚本
4. `/workspace/projects/monitor-build.sh` - 构建监控脚本
5. `/workspace/projects/SANDBOX_ANDROID_BUILD_GUIDE.md` - 详细构建指南
6. `/workspace/projects/android/local.properties` - SDK 路径配置

修改的文件：

1. `android/app/capacitor.build.gradle` - Java 版本改为 17
2. `android/capacitor-cordova-android-plugins/build.gradle` - Java 版本改为 17
3. `android/build.gradle` - 添加全局 Java 17 配置
4. `package.json` - Capacitor 版本从 8.x 降级到 7.x

## 下一步行动

### 短期方案（推荐）

1. **使用 GitHub Actions**：创建一个 GitHub Workflow，在云端构建 APK
2. **本地构建**：在 Windows 环境按照 `ANDROID_BUILD_STEPS.md` 文档构建

### 长期方案

1. **升级沙盒环境**：向平台申请 Java 21 支持
2. **使用 Docker**：创建一个包含 Java 21 和 Android SDK 的 Docker 镜像

## 附录

### Gradle 下载状态

- ✅ Gradle 8.14.3 已下载
- ❌ Gradle 8.11.1 下载中断（已清理）

### Capacitor 依赖

```
@capacitor/android: 7.4.5
@capacitor/cli: 7.4.5
@capacitor/core: 7.4.5
@capacitor/app: 7.1.1
@capacitor/haptics: 7.0.3
@capacitor/keyboard: 7.0.4
@capacitor/status-bar: 7.0.4
```

---

**最后更新时间**: 2026-01-22 15:10
**构建状态**: ❌ 失败
**主要阻碍**: Java 版本不兼容
