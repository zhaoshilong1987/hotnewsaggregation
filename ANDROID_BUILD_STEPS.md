# Android 打包完整步骤

> ⚠️ **重要提示**：
> - **沙盒环境限制**：本项目的沙盒环境（Coze Coding）未安装 Java JDK 和 Android SDK，无法直接执行 Android 打包操作。
> - **签名密钥生成**：`keytool` 命令需要在**本地开发环境**中运行，沙盒环境不支持。
> - **推荐流程**：使用沙盒环境开发 Web 功能，在本地环境进行 Android 打包。
> - **Android 构建**：完整的 APK/AAB 打包应在本地机器或 CI/CD 环境中完成。

---

## 一、环境准备

### 1. 安装必需工具

#### Java JDK
```bash
# macOS
brew install openjdk@17

# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# 验证安装
java -version
```

#### Android SDK
```bash
# 推荐使用 Android Studio 安装 SDK
# 下载地址：https://developer.android.com/studio

# 或手动下载 Android Command-line Tools
# https://developer.android.com/studio#command-tools

# 配置环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk       # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 安装 Android SDK 组件
通过 SDK Manager 安装以下组件：
- **Android SDK Platform-Tools** (最新版本)
- **Android SDK Build-Tools** (最新版本)
- **Android 14 (API 34)** 或更高版本的 SDK Platform
- **Android SDK Command-line Tools**

```bash
# 使用 SDK Manager 安装
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# 查看已安装组件
sdkmanager --list_installed
```

### 2. 沙盒环境限制说明

由于沙盒环境的限制，以下操作**必须在本地环境**完成：

| 操作 | 沙盒环境 | 本地环境 |
|-----|---------|---------|
| Web 开发和预览 | ✅ 支持 | ✅ 支持 |
| 生成签名密钥（keytool） | ❌ 不支持 | ✅ 支持 |
| 构建 Android APK | ❌ 不支持 | ✅ 支持 |
| 构建 App Bundle | ❌ 不支持 | ✅ 支持 |
| 运行 Android 模拟器 | ❌ 不支持 | ✅ 支持 |

**沙盒环境支持的功能**：
- Next.js 开发和构建
- 静态文件导出（用于 Android 打包）
- Capacitor 配置同步
- Web 预览和测试

**需要本地环境完成的操作**：
- 生成签名密钥
- 构建 APK/AAB
- 在真机或模拟器上测试

### 3. 验证环境

```bash
# 检查 Java 版本
java -version

# 检查 Android SDK
echo $ANDROID_HOME

# 检查 ADB
adb version

# 检查 Gradle（将在第一次构建时自动下载）
```

---

## 二、生成签名密钥（本地环境）

> ⚠️ **重要**：以下步骤必须在**本地开发环境**完成，沙盒环境不支持 `keytool` 命令。

### 1. 创建密钥库文件（仅需一次）

```bash
# 生成密钥库
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload

# 按提示输入：
# - Keystore password（密钥库密码）
# - Key password（密钥密码，可与 keystore 密码相同）
# - 姓名、组织、城市、省份、国家代码等信息
```

### 2. 保存密钥信息

⚠️ **重要**：将以下信息安全保存，配置打包时需要：

```
Keystore 文件: upload-keystore.jks
Key store password: [密钥库密码]
Key password: [密钥密码]
Key alias: upload
```

### 3. 保护密钥

```bash
# 将密钥库文件添加到 .gitignore
echo "upload-keystore.jks" >> .gitignore
echo "*.jks" >> .gitignore

# 将密钥库文件存放在安全位置（不要提交到 Git）
```

---

## 三、项目构建

### 1. 构建 Next.js 应用

```bash
# 进入项目目录
cd /path/to/your/project

# 安装依赖
pnpm install

# 构建生产版本
pnpm run build
```

**注意事项**：
- 如果项目有 API 路由，静态导出时需要注意（详见下方特殊处理）
- 本项目配置 `webDir: 'out'`，需要导出静态文件

### 2. 静态导出（如果需要）

```bash
# Next.js 15 推荐方式（已在 next.config.ts 中配置）
# 如果配置了 output: 'export'，直接运行 build 即可

# 或手动导出
npx next export -o out
```

### 3. 同步到 Capacitor

```bash
# 添加 Android 平台（首次运行）
npx cap add android

# 同步代码到 Android
npx cap sync android
```

---

## 四、配置签名

### 1. 创建签名配置文件

创建 `android/keystore.properties`：

```properties
storePassword=你的密钥库密码
keyPassword=你的密钥密码
keyAlias=upload
storeFile=../upload-keystore.jks  # 密钥库文件路径（相对于该配置文件）
```

⚠️ **不要将 `keystore.properties` 提交到 Git！**

添加到 `.gitignore`：
```bash
echo "android/keystore.properties" >> .gitignore
```

### 2. 修改 `android/app/build.gradle`

在 `android {}` 块之前添加：

```gradle
// 读取签名配置
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    namespace "com.hotnewsaggregation.news"  // Android 13+ 需要
    compileSdk 34

    defaultConfig {
        applicationId "com.hotnewsaggregation.news"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                storePassword keystoreProperties['storePassword']
            }
        }
    }

    buildTypes {
        debug {
            debuggable true
            minifyEnabled false
        }
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}
```

### 3. 创建 ProGuard 配置文件

创建 `android/app/proguard-rules.pro`：

```proguard
# Capacitor 规则
-keep class com.capacitorjs.** { *; }
-keep class com.getcapacitor.** { *; }
-keepattributes Signature
-keepattributes InnerClasses

# 保持 WebView JS 接口
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 保持 React Native 组件（如果有）
-keep class com.facebook.react.** { *; }

# 保持第三方库
-dontwarn okio.**
-dontwarn retrofit2.**
```

---

## 五、打包 APK

### 方法 1：命令行打包（推荐）

```bash
# 进入 Android 目录
cd android

# 清理旧构建
./gradlew clean

# 构建 Debug APK（用于测试）
./gradlew assembleDebug

# 构建 Release APK（用于发布）
./gradlew assembleRelease

# 输出位置
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

### 方法 2：Android Studio

```bash
# 打开 Android Studio
open -a "Android Studio" android  # macOS
# 或
npx cap open android

# 在 Android Studio 中：
# Build -> Build Bundle(s) / APK(s) -> Build APK(s)
# 或 Build -> Generate Signed Bundle / APK -> 选择 APK 或 Bundle
```

### 多渠道打包（可选）

```bash
# 构建所有变体
./gradlew assembleRelease

# 构建特定变体
./gradlew assembleRelease -Pchannel=google
./gradlew assembleRelease -Pchannel=huawei
```

---

## 六、构建 App Bundle（用于上架 Google Play）

```bash
cd android

# 构建 Release Bundle
./gradlew bundleRelease

# 输出位置
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 七、验证安装

### 1. 连接设备

```bash
# 启用 USB 调试
# 在手机上：设置 -> 开发者选项 -> USB 调试

# 连接设备并验证
adb devices
```

### 2. 安装 APK

```bash
# 安装 Debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 安装 Release APK
adb install android/app/build/outputs/apk/release/app-release.apk

# 覆盖安装（保留数据）
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. 查看日志

```bash
# 查看应用日志
adb logcat | grep "Capacitor"
adb logcat | grep "com.hotnewsaggregation.news"

# 清空日志
adb logcat -c
```

---

## 八、应用配置优化

### 1. 修改包名（appId）

编辑 `capacitor.config.ts`：

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.news',  // 修改为你的包名
  appName: '全网热点',
  // ...
}
```

重新同步：
```bash
npx cap sync android
```

### 2. 更新图标和启动屏

```bash
# 准备图标资源
# 放置到 resources/android/icon/ 目录

# 生成图标和启动屏资源
npx cap resources android
```

### 3. 修改应用名称和版本

编辑 `android/app/src/main/res/values/strings.xml`：

```xml
<resources>
    <string name="app_name">全网热点</string>
</resources>
```

编辑 `android/app/build.gradle` 修改版本号：

```gradle
defaultConfig {
    applicationId "com.hotnewsaggregation.news"
    versionCode 1          // 每次发布都要增加
    versionName "1.0.0"    // 显示给用户的版本号
}
```

### 4. 配置权限

编辑 `android/app/src/main/AndroidManifest.xml`：

```xml
<manifest ...>
    <!-- 网络权限（必需） -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- 相机权限（如果需要） -->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- 存储权限（如果需要） -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <!-- 位置权限（如果需要） -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
</manifest>
```

### 5. 配置网络安全

创建 `android/app/src/main/res/xml/network_security_config.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
    </domain-config>
</network-security-config>
```

在 `AndroidManifest.xml` 中引用：

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

---

## 九、上架 Google Play Store

### 1. 准备材料

- **Google Play 开发者账号**（$25 一次性费用）
- **应用图标**（512x512 高清图标）
- **应用截图**（手机和平板各至少 2 张）
- **隐私政策 URL**
- **内容评级问卷**

### 2. 创建应用

1. 登录 [Google Play Console](https://play.google.com/console)
2. 点击 **"创建应用"**
3. 填写应用基本信息（语言、应用名称、免费/付费）
4. 声明应用内容

### 3. 上传 App Bundle

1. 进入 **"发布"** > **"生产环境"**
2. 点击 **"创建新版本"**
3. 上传 `.aab` 文件（不是 `.apk`）
4. 填写版本说明

### 4. 填写应用信息

#### 商店列表
- 应用名称
- 简短描述（最多 80 字符）
- 完整描述
- 应用截图
- 宣传图（可选）
- 应用图标

#### 内容评级
- 完成内容评级问卷

#### 隐私政策
- 提供隐私政策 URL（必须可访问）

### 5. 选择发布类型

- **内测**：限定测试用户
- **公测**：开放给所有用户
- **正式发布**：所有人可见

### 6. 提交审核

点击 **"审核应用"**，等待 Google 审核（通常 1-3 天）

---

## 十、常见问题排查

### 0. 沙盒环境中 keytool: command not found

**错误信息**：
```
keytool: command not found
```

**原因**：沙盒环境未安装 Java JDK，无法执行 `keytool` 命令。

**解决方案**：
```bash
# 方案 1：在本地环境生成密钥（推荐）
# 1. 在本地安装 Java JDK
# 2. 在本地运行 keytool 生成密钥
# 3. 将生成的 keystore 文件复制到项目

# 方案 2：使用 Android Studio 生成
# 1. 打开 Android Studio
# 2. Build -> Generate Signed Bundle / APK
# 3. 点击 "Create new..." 创建密钥库

# 方案 3：仅构建 Debug APK（不需要签名）
cd android
./gradlew assembleDebug
# 输出: android/app/build/outputs/apk/debug/app-debug.apk
```

**详细步骤**：参见本文档第一节"环境准备"和第二节"生成签名密钥"。

---

### 1. 修改包名后应用无法启动

**原因**：包名修改后需要重新同步 Capacitor

**解决**：
```bash
npx cap sync android
cd android
./gradlew clean
./gradlew assembleDebug
```

### 2. 构建时提示找不到 Android SDK

**解决**：
```bash
# 检查环境变量
echo $ANDROID_HOME

# 重新配置环境变量
export ANDROID_HOME=/path/to/android/sdk

# 或在 local.properties 中指定
echo "sdk.dir=/path/to/android/sdk" > android/local.properties
```

### 3. 构建时提示 Java 版本不兼容

**解决**：
```bash
# 检查 Java 版本
java -version

# 切换到 JDK 17 或更高版本
export JAVA_HOME=/path/to/jdk17

# 或在 gradle.properties 中指定
echo "org.gradle.java.home=/path/to/jdk17" >> android/gradle.properties
```

### 4. Gradle 构建失败

**解决**：
```bash
cd android

# 清理构建
./gradlew clean

# 删除缓存
rm -rf .gradle build
rm -rf ~/.gradle/caches/

# 重新构建
./gradlew assembleDebug
```

### 5. 同步时提示 out 目录不存在

**原因**：Next.js 未正确导出静态文件

**解决**：
```bash
# 确保 next.config.ts 配置正确
# 检查 webDir 配置
cat capacitor.config.ts | grep webDir

# 重新构建
pnpm run build

# 检查 out 目录是否存在
ls -la out
```

### 6. APK 安装后无法联网

**原因**：网络安全配置或权限问题

**解决**：
```bash
# 检查权限
grep "INTERNET" android/app/src/main/AndroidManifest.xml

# 检查网络安全配置
cat android/app/src/main/res/xml/network_security_config.xml

# 允许 cleartext（仅开发环境）
# 在 AndroidManifest.xml 的 <application> 标签中添加
android:usesCleartextTraffic="true"
```

### 7. 应用闪退

**解决**：
```bash
# 查看崩溃日志
adb logcat | grep "FATAL"

# 连接手机，启用开发者选项
# 设置 -> 开发者选项 -> Bug 报告 -> 捕获错误

# 使用 Android Studio 查看日志
View -> Tool Windows -> Logcat
```

### 8. 构建速度慢

**优化**：
```bash
# 启用 Gradle 缓存
echo "org.gradle.caching=true" >> android/gradle.properties
echo "org.gradle.parallel=true" >> android/gradle.properties
echo "org.gradle.jvmargs=-Xmx2048m" >> android/gradle.properties

# 使用 Gradle Daemon（默认已启用）
```

---

## 十一、快速命令清单

### 日常开发

```bash
# 构建 Web
pnpm install
pnpm run build

# 同步到 Android
npx cap sync android

# 运行到设备
npx cap run android
```

### 打包 APK

```bash
# 1. 构建 Web
pnpm run build

# 2. 同步到 Android
npx cap sync android

# 3. 打包 APK
cd android
./gradlew clean
./gradlew assembleDebug      # Debug 版本
./gradlew assembleRelease    # Release 版本

# 4. 输出位置
# android/app/build/outputs/apk/debug/app-debug.apk
# android/app/build/outputs/apk/release/app-release.apk
```

### 打包 App Bundle

```bash
# 1. 构建 Web
pnpm run build

# 2. 同步到 Android
npx cap sync android

# 3. 打包 Bundle
cd android
./gradlew bundleRelease

# 4. 输出位置
# android/app/build/outputs/bundle/release/app-release.aab
```

### 清理和重置

```bash
# 清理构建
cd android && ./gradlew clean

# 删除 Android 平台
npx cap remove android

# 重新添加平台
npx cap add android
npx cap sync android
```

---

## 十二、版本管理建议

### 版本号规则

- `versionCode`: 整数，每次发布递增（1, 2, 3...）
- `versionName`: 字符串，显示给用户（1.0.0, 1.1.0, 2.0.0...）

```gradle
defaultConfig {
    versionCode 1
    versionName "1.0.0"
}
```

### 版本号递增建议

- **小更新**（Bug 修复）：1.0.1（versionCode: 2）
- **中更新**（新功能）：1.1.0（versionCode: 3）
- **大更新**（重大变更）：2.0.0（versionCode: 10）

### 发布流程

1. 更新 `android/app/build.gradle` 中的版本号
2. 更新 `capacitor.config.ts` 中的版本（如需要）
3. 构建新版本
4. 测试验证
5. 提交到应用商店

---

## 附录

### 相关文档

- [Capacitor Android 指南](https://capacitorjs.com/docs/android)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console 帮助](https://support.google.com/googleplay/android-developer)

### 工具参考

- [keytool 文档](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)
- [adb 命令参考](https://developer.android.com/studio/command-line/adb)
- [Gradle 命令参考](https://docs.gradle.org/current/userguide/command_line_interface.html)

---

**最后更新**：2025-01-21
