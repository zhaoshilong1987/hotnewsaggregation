# Android 打包完整步骤

> ⚠️ **重要提示**：
> - **沙盒环境限制**：本项目的沙盒环境（Coze Coding）未安装 Java JDK 和 Android SDK，无法直接执行 Android 打包操作。
> - **签名密钥生成**：`keytool` 命令需要在**本地开发环境**中运行，沙盒环境不支持。
> - **推荐流程**：使用沙盒环境开发 Web 功能，在本地环境进行 Android 打包。
> - **Android 构建**：完整的 APK/AAB 打包应在本地机器或 CI/CD 环境中完成。

---

## 一、环境准备

### 0. Windows 环境前置配置

#### 安装 pnpm 包管理器

**Windows 环境必须先安装 pnpm，否则无法执行项目命令。**

**方法 1：使用 npm 全局安装（推荐）**
```powershell
# 使用 npm 全局安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

**方法 2：使用独立安装脚本**
```powershell
# 下载并运行 pnpm 安装脚本
iwr https://get.pnpm.io/install.ps1 -useb | iex

# 验证安装
pnpm --version
```

**方法 3：使用 Chocolatey**
```powershell
# 使用 Chocolatey 安装（需要管理员权限）
choco install pnpm

# 验证安装
pnpm --version
```

**方法 4：使用 Scoop**
```powershell
# 使用 Scoop 安装
scoop install pnpm

# 验证安装
pnpm --version
```

#### 配置 PowerShell 执行策略（如需要）

如果执行 pnpm 命令时提示"无法加载文件"，需要配置执行策略：

```powershell
# 临时允许脚本执行（仅当前会话，推荐）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 或使用 CMD 代替 PowerShell（更简单）
# 在 CMD 中执行 pnpm 命令，不受 PowerShell 执行策略限制
```

#### 使用构建替代方案（避免 bash 脚本依赖）

Windows 环境下，项目构建脚本依赖 bash，推荐使用以下替代方案：

```powershell
# 方法 1：使用 pnpm run build:vercel（推荐）
pnpm run build:vercel

# 方法 2：直接使用 Next.js 构建
npx next build

# 方法 3：安装 Git Bash 后使用 pnpm run build
# https://git-scm.com/download/win
```

### 1. 安装必需工具

#### Java JDK

**Windows:**
```powershell
# 方法 1：使用 Chocolatey（推荐）
choco install openjdk17

# 方法 2：手动下载安装
# 下载地址：https://www.oracle.com/java/technologies/downloads/
# 选择 Windows x64 Installer 版本
# 安装后配置环境变量

# 配置环境变量（系统环境变量）
# JAVA_HOME=C:\Program Files\Java\jdk-17
# Path 添加 %JAVA_HOME%\bin

# 验证安装
java -version
```

**macOS:**
```bash
# 使用 Homebrew 安装
brew install openjdk@17

# 验证安装
java -version
```

**Ubuntu/Debian:**
```bash
# 安装 OpenJDK
sudo apt update
sudo apt install openjdk-17-jdk

# 验证安装
java -version
```

#### Android SDK

**Windows:**
```powershell
# 推荐：使用 Android Studio 安装 SDK
# 1. 下载 Android Studio：https://developer.android.com/studio
# 2. 运行安装程序，勾选 "Android SDK Platform-Tools"
# 3. 启动 Android Studio，打开 SDK Manager
# 4. 安装以下组件：
#    - Android SDK Platform-Tools
#    - Android SDK Build-Tools 34.0.0
#    - Android 14 (API 34)
#    - Android SDK Command-line Tools

# 配置环境变量（系统环境变量）
# ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk
# Path 添加：
#   %ANDROID_HOME%\emulator
#   %ANDROID_HOME%\tools
#   %ANDROID_HOME%\tools\bin
#   %ANDROID_HOME%\platform-tools

# 或使用 PowerShell 临时配置
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:ANDROID_HOME\platform-tools"

# 验证环境变量
echo $env:ANDROID_HOME
```

**macOS:**
```bash
# 推荐使用 Android Studio 安装 SDK
# 下载地址：https://developer.android.com/studio

# 或手动下载 Android Command-line Tools
# https://developer.android.com/studio#command-tools

# 配置环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Ubuntu/Debian:**
```bash
# 推荐使用 Android Studio 安装 SDK
# 下载地址：https://developer.android.com/studio

# 配置环境变量
export ANDROID_HOME=$HOME/Android/Sdk

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

**Windows:**
```powershell
# 使用 SDK Manager 安装
# 进入 SDK 目录
cd "$env:ANDROID_HOME\cmdline-tools\latest\bin"

# 安装组件
.\sdkmanager.bat "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# 查看已安装组件
.\sdkmanager.bat --list_installed

# 或使用 Android Studio 的 SDK Manager
# Tools > SDK Manager > SDK Platforms / SDK Tools
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 检查 Java 版本
java -version

# 检查 Android SDK
echo $env:ANDROID_HOME

# 检查 ADB
adb version

# 检查 Gradle（将在第一次构建时自动下载）
# Gradle Wrapper 会自动下载，无需手动安装
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 生成密钥库
keytool -genkey -v -keystore upload-keystore.jks `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias upload

# 按提示输入：
# - Keystore password（密钥库密码）
# - Re-enter new password（再次输入密码）
# - What is your first and last name?（姓名或组织名称）
# - What is the name of your organizational unit?（部门名称，可直接回车）
# - What is the name of your organization?（组织名称）
# - What is the name of your City or Locality?（城市）
# - What is the name of your State or Province?（省份）
# - What is the two-letter country code for this unit?（国家代码，如 CN）
# - Is CN=xxx correct?（确认信息，输入 yes）
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 将密钥库文件添加到 .gitignore
Add-Content .gitignore "upload-keystore.jks"
Add-Content .gitignore "*.jks"

# 将密钥库文件存放在安全位置（不要提交到 Git）
# 建议将密钥库文件移动到其他目录，如 C:\Keys\
# Move-Item upload-keystore.jks C:\Keys\
```

**macOS / Linux:**
```bash
# 将密钥库文件添加到 .gitignore
echo "upload-keystore.jks" >> .gitignore
echo "*.jks" >> .gitignore

# 将密钥库文件存放在安全位置（不要提交到 Git）
```

---

## 三、项目构建

### 1. 构建 Next.js 应用

**Windows:**
```powershell
# 进入项目目录
cd C:\path\to\your\project

# 安装依赖（如果已安装 pnpm）
pnpm install

# 构建生产版本（推荐使用 build:vercel 避免脚本依赖）
pnpm run build:vercel

# 或直接使用 Next.js 构建
npx next build

# 如果使用 Git Bash 或 WSL，也可以使用：
pnpm run build
```

**macOS / Linux:**
```bash
# 进入项目目录
cd /path/to/your/project

# 安装依赖
pnpm install

# 构建生产版本
pnpm run build
```

**Windows 环境特别说明**：

| 问题 | 解决方案 |
|-----|---------|
| pnpm 命令无法识别 | 使用 `npm install -g pnpm` 全局安装 |
| PowerShell 执行策略限制 | 使用 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` 临时允许 |
| 构建脚本依赖 bash | 使用 `pnpm run build:vercel` 或 `npx next build` 替代 `pnpm run build` |
| 不想配置 PowerShell | 使用 CMD 终端执行命令 |

**注意事项**：
- 如果项目有 API 路由，静态导出时需要注意（详见下方特殊处理）
- 本项目配置 `webDir: 'out'`，需要导出静态文件
- Windows 环境推荐使用 `pnpm run build:vercel` 避免脚本兼容性问题

### 2. 静态导出（如果需要）

```bash
# Next.js 15 推荐方式（已在 next.config.ts 中配置）
# 如果配置了 output: 'export'，直接运行 build 即可

# Windows 环境使用：
npx next build

# macOS / Linux 或已安装 Git Bash 的 Windows 环境：
pnpm run build
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

**Windows:**
```powershell
Add-Content .gitignore "android/keystore.properties"
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 进入 Android 目录
cd android

# 清理旧构建
.\gradlew.bat clean

# 构建 Debug APK（用于测试）
.\gradlew.bat assembleDebug

# 构建 Release APK（用于发布）
.\gradlew.bat assembleRelease

# 输出位置
# Debug: android\app\build\outputs\apk\debug\app-debug.apk
# Release: android\app\build\outputs\apk\release\app-release.apk
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 打开 Android Studio
# 方法 1：使用 Capacitor 命令
npx cap open android

# 方法 2：直接打开
# 双击 android 目录
# 或使用：
start android

# 在 Android Studio 中：
# Build -> Build Bundle(s) / APK(s) -> Build APK(s)
# 或 Build -> Generate Signed Bundle / APK -> 选择 APK 或 Bundle
```

**macOS / Linux:**
```bash
# 打开 Android Studio
open -a "Android Studio" android  # macOS
# 或
npx cap open android

# 在 Android Studio 中：
# Build -> Build Bundle(s) / APK(s) -> Build APK(s)
```
# 或 Build -> Generate Signed Bundle / APK -> 选择 APK 或 Bundle
```

### 多渠道打包（可选）

**Windows:**
```powershell
# 构建所有变体
.\gradlew.bat assembleRelease

# 构建特定变体
.\gradlew.bat assembleRelease -Pchannel=google
.\gradlew.bat assembleRelease -Pchannel=huawei
```

**macOS / Linux:**
```bash
# 构建所有变体
./gradlew assembleRelease

# 构建特定变体
./gradlew assembleRelease -Pchannel=google
./gradlew assembleRelease -Pchannel=huawei
```

---

## 六、构建 App Bundle（用于上架 Google Play）

**Windows:**
```powershell
cd android

# 构建 Release Bundle
.\gradlew.bat bundleRelease

# 输出位置
# android\app\build\outputs\bundle\release\app-release.aab
```

**macOS / Linux:**
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

**Windows / macOS / Linux:**
```bash
# 启用 USB 调试
# 在手机上：设置 -> 开发者选项 -> USB 调试

# 连接设备并验证
adb devices
```

### 2. 安装 APK

**Windows:**
```powershell
# 安装 Debug APK
adb install android\app\build\outputs\apk\debug\app-debug.apk

# 安装 Release APK
adb install android\app\build\outputs\apk\release\app-release.apk

# 覆盖安装（保留数据）
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 检查环境变量
echo $env:ANDROID_HOME

# 重新配置环境变量
# 方法 1：系统环境变量
# 系统属性 -> 环境变量 -> 系统变量 -> 新建
# 变量名：ANDROID_HOME
# 变量值：C:\Users\你的用户名\AppData\Local\Android\Sdk

# 方法 2：在 local.properties 中指定
"sdk.dir=C:\\Users\\$env:USERNAME\\AppData\\Local\\Android\\Sdk" | Out-File -Encoding UTF8 android/local.properties
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 检查 Java 版本
java -version

# 切换到 JDK 17 或更高版本
# 方法 1：更新系统环境变量 JAVA_HOME
# 方法 2：在 gradle.properties 中指定
"org.gradle.java.home=C:\\Program Files\\Java\\jdk-17" | Out-File -Encoding UTF8 -Append android/gradle.properties

# 方法 3：使用 Gradle JVM（Android Studio）
# File -> Settings -> Build, Execution, Deployment -> Build Tools -> Gradle
# Gradle JDK: 选择 JDK 17
```

**macOS / Linux:**
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

**Windows:**
```powershell
cd android

# 清理构建
.\gradlew.bat clean

# 删除缓存
Remove-Item -Recurse -Force .gradle
Remove-Item -Recurse -Force build
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"

# 重新构建
.\gradlew.bat assembleDebug
```

**macOS / Linux:**
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

**错误信息**：
```
copy android [warn] Cannot copy web assets from out to android\app\src\main\assets\public
Web asset directory specified by webDir does not exist.
```

**原因**：
1. Android 平台未完全初始化
2. Next.js 未构建，`out` 目录不存在

**解决方法 1：首次初始化（推荐）**

**Windows:**
```powershell
# 1. 添加 Android 平台（创建完整的 Android 目录结构）
npx cap add android

# 2. 构建 Next.js 应用，生成 out 目录
pnpm run build:vercel

# 3. 验证 out 目录是否存在
Get-ChildItem out

# 4. 同步到 Android
npx cap sync android
```

**macOS / Linux:**
```bash
# 1. 添加 Android 平台
npx cap add android

# 2. 构建 Next.js 应用
pnpm run build

# 3. 验证 out 目录
ls -la out

# 4. 同步到 Android
npx cap sync android
```

**解决方法 2：清理并重新初始化**

**Windows:**
```powershell
# 1. 删除 Android 平台
npx cap remove android

# 2. 删除构建输出
Remove-Item -Recurse -Force out

# 3. 检查 capacitor.config.ts 的 webDir 配置
Select-String -Path capacitor.config.ts -Pattern "webDir"

# 应该是：webDir: 'out',

# 4. 重新构建
pnpm run build:vercel

# 5. 重新添加 Android 平台
npx cap add android

# 6. 同步
npx cap sync android
```

**macOS / Linux:**
```bash
# 1. 删除 Android 平台
npx cap remove android

# 2. 删除构建输出
rm -rf out

# 3. 检查 webDir 配置
cat capacitor.config.ts | grep webDir

# 4. 重新构建
pnpm run build

# 5. 重新添加 Android 平台
npx cap add android

# 6. 同步
npx cap sync android
```

**解决方法 3：手动创建目录（不推荐）**

**Windows:**
```powershell
# 手动创建缺失的目录
New-Item -ItemType Directory -Force -Path "android\app\src\main\assets"

# 然后执行同步
npx cap sync android
```

**macOS / Linux:**
```bash
# 手动创建缺失的目录
mkdir -p android/app/src/main/assets

# 然后执行同步
npx cap sync android
```

**检查配置**：

确保 `capacitor.config.ts` 中的 webDir 配置正确：

```typescript
const config: CapacitorConfig = {
  appId: 'com.hotnewsaggregation.news',
  appName: '全网热点',
  webDir: 'out',  // ⚠️ 必须是 'out'，与 Next.js 输出目录一致
  // ...
}
```

**验证步骤**：

**Windows:**
```powershell
# 1. 检查 out 目录是否存在
Test-Path out

# 2. 检查 Android 平台是否已添加
Test-Path android

# 3. 检查 capacitor.config.ts 配置
Select-String -Path capacitor.config.ts -Pattern "webDir"
```

### 6. APK 安装后无法联网

**原因**：网络安全配置或权限问题

**解决**：

**Windows / macOS / Linux:**
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

**Windows:**
```powershell
# 启用 Gradle 缓存
"org.gradle.caching=true" | Out-File -Encoding UTF8 -Append android/gradle.properties
"org.gradle.parallel=true" | Out-File -Encoding UTF8 -Append android/gradle.properties
"org.gradle.jvmargs=-Xmx2048m" | Out-File -Encoding UTF8 -Append android/gradle.properties

# 使用 Gradle Daemon（默认已启用）
```

**macOS / Linux:**
```bash
# 启用 Gradle 缓存
echo "org.gradle.caching=true" >> android/gradle.properties
echo "org.gradle.parallel=true" >> android/gradle.properties
echo "org.gradle.jvmargs=-Xmx2048m" >> android/gradle.properties

# 使用 Gradle Daemon（默认已启用）
```

### 9. Windows 上执行 gradlew.bat 提示权限错误

**错误信息**：
```
无法加载文件 gradlew.bat，因为在此系统上禁止运行脚本
```

**解决**：
```powershell
# 方法 1：临时允许脚本执行
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 方法 2：以管理员身份运行 PowerShell
# 右键点击 PowerShell -> 以管理员身份运行

# 方法 3：检查文件是否有执行权限
# 确保 gradlew.bat 文件存在
Test-Path android\gradlew.bat

# 方法 4：使用 Android Studio 构建
# File -> Sync Project with Gradle Files
# Build -> Build Bundle(s) / APK(s) -> Build APK(s)
```

### 10. Windows 环境下 pnpm 命令无法识别

**错误信息**：
```
pnpm : 无法将"pnpm"项识别为 cmdlet、函数、脚本文件或可运行程序的名称
```

**原因**：Windows 环境未安装 pnpm 包管理器

**解决方案**：

**方法 1：使用 npm 全局安装（推荐）**
```powershell
# 使用 npm 全局安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

**方法 2：使用独立安装脚本**
```powershell
# 下载并运行 pnpm 安装脚本
iwr https://get.pnpm.io/install.ps1 -useb | iex

# 验证安装
pnpm --version
```

**方法 3：使用 Chocolatey**
```powershell
# 使用 Chocolatey 安装（需要管理员权限）
choco install pnpm

# 验证安装
pnpm --version
```

**方法 4：使用 Scoop**
```powershell
# 使用 Scoop 安装
scoop install pnpm

# 验证安装
pnpm --version
```

### 11. PowerShell 执行策略限制导致 npm 无法加载

**错误信息**：
```
无法加载文件，因为在此系统上禁止运行脚本
```

**原因**：PowerShell 默认执行策略限制

**解决方案**：

**方法 1：临时允许脚本执行（推荐）**
```powershell
# 仅在当前 PowerShell 会话中临时允许脚本执行
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 然后执行 pnpm 命令
pnpm install
```

**方法 2：使用 CMD 代替 PowerShell**
```cmd
# 使用 CMD 终端执行命令，不受 PowerShell 执行策略限制
cd C:\path\to\your\project
pnpm install
pnpm run build
```

**方法 3：以管理员身份运行 PowerShell**
```powershell
# 右键点击 PowerShell -> 以管理员身份运行
# 然后修改执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 12. Windows 执行 pnpm run build 报错提示安装 WSL

**错误信息**：
```
bash: ./scripts/build.sh: No such file or directory
# 或
系统找不到指定的文件
```

**原因**：项目构建脚本依赖 bash (`bash ./scripts/build.sh`)，Windows 环境默认不支持

**解决方案**：

**方法 1：使用 pnpm run build:vercel（推荐）**
```powershell
# 使用直接调用 Next.js 构建，避免 bash 脚本依赖
pnpm run build:vercel

# 这个命令等同于直接运行：
npx next build
```

**方法 2：使用直接命令**
```powershell
# 直接调用 Next.js 构建
npx next build
```

**方法 3：安装 Git Bash**
```powershell
# 1. 安装 Git for Windows
# https://git-scm.com/download/win

# 2. 使用 Git Bash 执行命令
# 打开 Git Bash，在项目目录执行：
cd /c/path/to/your/project
pnpm run build
```

**方法 4：安装 WSL（Windows Subsystem for Linux）**
```powershell
# 1. 启用 WSL 功能（需要管理员权限）
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 2. 重启电脑

# 3. 在 Microsoft Store 中安装 Linux 发行版（如 Ubuntu）

# 4. 使用 WSL 执行命令
wsl
cd /mnt/c/path/to/your/project
pnpm run build
```

---

## 十一、快速命令清单

### 日常开发

**Windows:**
```powershell
# 构建 Web
pnpm install
pnpm run build

# 同步到 Android
npx cap sync android

# 运行到设备
npx cap run android
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 1. 构建 Web
pnpm run build

# 2. 同步到 Android
npx cap sync android

# 3. 打包 APK
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug      # Debug 版本
.\gradlew.bat assembleRelease    # Release 版本

# 4. 输出位置
# android\app\build\outputs\apk\debug\app-debug.apk
# android\app\build\outputs\apk\release\app-release.apk
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 1. 构建 Web
pnpm run build

# 2. 同步到 Android
npx cap sync android

# 3. 打包 Bundle
cd android
.\gradlew.bat bundleRelease

# 4. 输出位置
# android\app\build\outputs\bundle\release\app-release.aab
```

**macOS / Linux:**
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

**Windows:**
```powershell
# 清理构建
cd android
.\gradlew.bat clean

# 删除 Android 平台
npx cap remove android

# 重新添加平台
npx cap add android
npx cap sync android
```

**macOS / Linux:**
```bash
# 清理构建
cd android && ./gradlew clean

# 删除 Android 平台
npx cap remove android

# 重新添加平台
npx cap add android
npx cap sync android
```
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

### Windows 环境完整配置示例

#### 1. 安装 Java JDK

```powershell
# 使用 Chocolatey 安装（需要管理员权限）
choco install openjdk17

# 验证安装
java -version

# 配置环境变量
# 系统属性 -> 环境变量 -> 系统变量
# 新建：
# - JAVA_HOME = C:\Program Files\Java\jdk-17
# 编辑 Path，添加：
# - %JAVA_HOME%\bin
```

#### 2. 安装 Android Studio 和 SDK

```powershell
# 1. 下载并安装 Android Studio
# https://developer.android.com/studio

# 2. 启动 Android Studio，完成初始设置

# 3. 打开 SDK Manager
# Tools -> SDK Manager

# 4. 安装以下组件：
#    - SDK Platforms: Android 14 (API 34)
#    - SDK Tools:
#      - Android SDK Build-Tools 34.0.0
#      - Android SDK Platform-Tools
#      - Android SDK Command-line Tools (latest)

# 5. 配置环境变量
# 系统属性 -> 环境变量 -> 系统变量
# 新建：
# - ANDROID_HOME = C:\Users\你的用户名\AppData\Local\Android\Sdk
# 编辑 Path，添加：
# - %ANDROID_HOME%\emulator
# - %ANDROID_HOME%\platform-tools
# - %ANDROID_HOME%\tools
# - %ANDROID_HOME%\tools\bin
```

#### 3. 生成签名密钥

```powershell
# 进入项目目录
cd C:\path\to\your\project

# 生成密钥库
keytool -genkey -v -keystore upload-keystore.jks `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias upload

# 创建签名配置文件
@"
storePassword=你的密钥库密码
keyPassword=你的密钥密码
keyAlias=upload
storeFile=../upload-keystore.jks
"@ | Out-File -Encoding UTF8 android\keystore.properties
```

#### 4. 构建项目

```powershell
# 安装依赖
pnpm install

# 构建生产版本
pnpm run build

# 同步到 Android
npx cap sync android
```

#### 5. 构建 APK

```powershell
# 进入 Android 目录
cd android

# 清理旧构建
.\gradlew.bat clean

# 构建 Debug APK
.\gradlew.bat assembleDebug

# 构建 Release APK
.\gradlew.bat assembleRelease

# APK 输出位置
# android\app\build\outputs\apk\debug\app-debug.apk
# android\app\build\outputs\apk\release\app-release.apk
```

#### 6. 安装到设备

```powershell
# 连接设备（启用 USB 调试）
adb devices

# 安装 APK
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

#### 7. PowerShell 执行策略问题

如果执行 `gradlew.bat` 时提示权限错误：

```powershell
# 临时允许脚本执行（仅当前会话）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 或以管理员身份运行 PowerShell
# 右键 -> 以管理员身份运行
```

#### 8. Git Bash 替代方案

如果你更喜欢使用 Git Bash：

```bash
# 在 Git Bash 中，命令与 macOS/Linux 相同
cd android
./gradlew clean
./gradlew assembleDebug
./gradlew assembleRelease
```

### 相关文档

- [Capacitor Android 指南](https://capacitorjs.com/docs/android)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console 帮助](https://support.google.com/googleplay/android-developer)

### 工具参考

- [keytool 文档](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)
- [adb 命令参考](https://developer.android.com/studio/command-line/adb)
- [Gradle 命令参考](https://docs.gradle.org/current/userguide/command_line_interface.html)

---

## 十三、部署配置（Vercel + 沙盒环境）

### 1. 从 Cloudflare Pages 切换到 Vercel

本项目已从 Cloudflare Pages 切换到 Vercel 作为主要部署平台，主要原因：

- Vercel 对 Next.js 支持更完善
- 避免在无 Java 环境下触发 Android 构建
- 更好的 CI/CD 集成

### 2. Vercel 部署配置

#### 创建 .vercelignore 文件

在项目根目录创建 `.vercelignore`，忽略移动端相关文件：

```
# Vercel 部署时忽略的文件和目录

# 移动端平台文件
android/
ios/
.capacitor/

# 密钥文件
upload-keystore.jks
*.jks
keystore.properties

# 其他不需要部署的文件
*.log
.DS_Store
Thumbs.db
```

**作用**：
- Vercel 部署时不会上传 Android/iOS 相关文件
- 避免在 Vercel 构建环境中触发 Capacitor postinstall 脚本
- 保护签名密钥不被上传

### 3. 配置 Vercel 跳过 Capacitor postinstall 脚本

在 `package.json` 中配置：

```json
{
  "scripts": {
    "postinstall": "capacitor sync",
    "postinstall:vercel": "echo 'Skipping Capacitor sync on Vercel'"
  }
}
```

在 Vercel 项目设置中配置环境变量：

- `VERCEL` = `1`（Vercel 自动提供）
- 使用环境变量判断是否在 Vercel 环境

### 4. Vercel 构建命令配置

在 Vercel 项目设置中配置：

**构建命令**：
```
pnpm install
pnpm run build:vercel
```

**输出目录**：
```
out
```

**环境变量**（可选）：
```
NEXT_PUBLIC_API_URL=https://your-api.com
```

### 5. 沙盒环境与本地环境协作

#### 沙盒环境（Web 开发）

**适用场景**：
- Web 功能开发和调试
- UI/UX 开发
- API 接口开发
- 代码编写和测试

**操作流程**：
```bash
# 在沙盒环境中
cd /workspace/projects/your-project

# 安装依赖（如需要）
pnpm install

# 启动开发服务器
coze dev

# 修改代码会自动热更新

# 构建生产版本（用于 Android 打包）
pnpm run build:vercel
```

#### 本地环境（Android 打包）

**适用场景**：
- Android APK/AAB 打包
- 真机测试
- 应用上架

**操作流程**：
```powershell
# 在本地 Windows 环境中
cd C:\path\to\your\project

# 1. 从沙盒环境复制代码到本地
# 使用 git clone 或手动复制

# 2. 安装依赖（如果未安装 pnpm）
npm install -g pnpm
pnpm install

# 3. 构建 Web 应用
pnpm run build:vercel

# 4. 同步到 Android
npx cap sync android

# 5. 打包 APK
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug    # Debug 版本
.\gradlew.bat assembleRelease  # Release 版本
```

### 6. 最佳实践

#### 开发流程

1. **日常开发（沙盒环境）**
   - 使用沙盒环境进行 Web 功能开发
   - 利用热更新快速迭代
   - 在浏览器中测试 Web 功能

2. **移动端测试（本地环境）**
   - 定期将代码同步到本地环境
   - 构建 Android APK
   - 在真机上测试移动端功能

3. **版本发布（本地环境）**
   - 在本地环境生成签名密钥
   - 构建 Release APK/AAB
   - 上架 Google Play Store

#### 代码同步策略

```bash
# 方案 1：使用 Git（推荐）
# 沙盒环境提交代码
git add .
git commit -m "feat: add new feature"
git push origin main

# 本地环境拉取代码
git pull origin main

# 方案 2：手动复制（简单但不推荐）
# 从沙盒环境导出文件
# 复制到本地环境
```

#### 忽略文件管理

确保 `.gitignore` 包含以下内容：

```
# 移动端平台文件（仅在本地环境生成）
android/
ios/
.capacitor/

# 密钥文件（仅在本地环境生成）
upload-keystore.jks
*.jks
keystore.properties

# 其他忽略
node_modules/
.next/
out/
dist/
```

---

**最后更新**：2025-01-21
