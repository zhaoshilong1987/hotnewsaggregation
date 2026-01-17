# Android APK 构建指南

## 环境要求

在构建 Android APK 之前，请确保你的开发环境满足以下要求：

### 必需软件

1. **Java Development Kit (JDK)**
   - 版本：JDK 11 或更高
   - 下载：https://www.oracle.com/java/technologies/downloads/

2. **Android Studio**
   - 版本：最新稳定版
   - 下载：https://developer.android.com/studio
   - 安装后需要配置 Android SDK

3. **Android SDK**
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - 至少一个 Android SDK Platform（推荐 API 33 或更高）

4. **Node.js**
   - 版本：Node.js 18 或更高
   - 下载：https://nodejs.org/

### 环境变量配置

确保以下环境变量已正确配置：

```bash
# Java
JAVA_HOME=/path/to/jdk

# Android SDK
ANDROID_HOME=/path/to/android-sdk
ANDROID_SDK_ROOT=/path/to/android-sdk

# Path
export PATH=$PATH:$JAVA_HOME/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

## 构建步骤

### 1. 安装项目依赖

```bash
# 进入项目目录
cd /path/to/project

# 使用 pnpm 安装依赖
pnpm install
```

### 2. 构建生产版本

```bash
# 构建 Next.js 静态导出版本
pnpm build
```

### 3. 同步到 Android 项目

```bash
# 将构建的静态文件同步到 Android 项目
npx cap sync android
```

### 4. 打开 Android Studio

```bash
# 方法一：通过 Capacitor 命令打开
npx cap open android

# 方法二：直接打开 Android Studio
# 打开项目目录下的 android 文件夹
open -a "Android Studio" android  # macOS
# 或
start android  # Windows
# 或
xdg-open android  # Linux
```

### 5. 在 Android Studio 中构建 APK

#### 方式一：Debug APK（用于测试）

1. 在 Android Studio 中，点击菜单 `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
2. 等待构建完成
3. 构建完成后，会弹出通知，点击 `locate` 定位 APK 文件
4. APK 文件通常位于：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 方式二：Release APK（用于发布）

1. 配置签名密钥（首次构建需要）

   ```bash
   # 生成密钥库
   keytool -genkey -v -keystore your-release-key.keystore -alias your-alias-name -keyalg RSA -keysize 2048 -validity 10000
   ```

2. 在 `android/key.properties` 文件中配置密钥信息：

   ```properties
   storePassword=your-password
   keyPassword=your-password
   keyAlias=your-alias-name
   storeFile=path/to/your-release-key.keystore
   ```

   注意：将 `path/to/your-release-key.keystore` 替换为实际的文件路径，建议使用相对路径如 `../your-release-key.keystore`

3. 修改 `android/app/build.gradle` 文件，添加签名配置：

   ```gradle
   android {
       // ... 其他配置

       signingConfigs {
           release {
               if (project.hasProperty('keystoreFile')) {
                   def keystorePropertiesFile = rootProject.file("key.properties")
                   def keystoreProperties = new Properties()
                   keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

                   keyAlias keystoreProperties['keyAlias']
                   keyPassword keystoreProperties['keyPassword']
                   storeFile file(keystoreProperties['storeFile'])
                   storePassword keystoreProperties['storePassword']
               }
           }
       }

       buildTypes {
           release {
               signingConfig signingConfigs.release
               // ... 其他配置
           }
       }
   }
   ```

4. 构建 Release APK：

   - 点击菜单 `Build` > `Generate Signed Bundle / APK`
   - 选择 `APK`
   - 选择你的密钥库
   - 选择 `release` 构建类型
   - 点击 `Finish`

5. APK 文件位置：`android/app/build/outputs/apk/release/app-release.apk`

### 6. 在真机上测试

#### 通过 USB 连接

1. 在手机上启用开发者选项和 USB 调试
2. 通过 USB 连接手机
3. 运行以下命令安装 APK：

   ```bash
   # 安装 APK
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### 通过 Capacitor 直接运行（开发模式）

```bash
# 在 Android 设备上运行应用
npx cap run android
```

## 常见问题

### 1. 构建时提示找不到 Android SDK

**解决方案**：
- 检查 `ANDROID_HOME` 环境变量是否正确设置
- 确认 Android SDK 是否已安装所需的组件
- 在 Android Studio 的 SDK Manager 中安装缺失的组件

### 2. 构建时提示 Java 版本不兼容

**解决方案**：
- 检查 `JAVA_HOME` 是否指向正确的 JDK 版本
- 确认 JDK 版本为 11 或更高
- 可以通过 `java -version` 命令检查当前版本

### 3. Gradle 构建失败

**解决方案**：
- 删除 `android/.gradle` 目录
- 删除 `android/build` 目录
- 在 Android Studio 中点击 `File` > `Invalidate Caches / Restart`
- 重新构建项目

### 4. 同步时提示 out 目录不存在

**解决方案**：
- 确保已经运行了 `pnpm build` 命令
- 检查 `capacitor.config.ts` 中的 `webDir` 配置是否正确
- 当前配置为 `webDir: 'out'`

### 5. APK 安装失败

**解决方案**：
- 确认手机已开启 USB 调试模式
- 检查 adb 是否可以识别设备：`adb devices`
- 如果是 Release APK，确保签名配置正确

## 项目信息

- **应用名称**：热榜资讯
- **包名**：com.rebang.news
- **平台**：Android
- **框架**：Next.js + Capacitor

## 开发模式

如果需要在开发模式下实时预览更改：

1. 启动 Next.js 开发服务器：

   ```bash
   pnpm dev
   ```

2. 在另一个终端窗口运行 Android 应用：

   ```bash
   npx cap run android --livereload --external
   ```

   这会启用实时重载功能，当你修改代码后会自动刷新应用。

## 发布到应用商店

如果要发布到 Google Play 或其他应用商店：

1. 生成 Release APK 或 AAB（Android App Bundle）
2. 在 Google Play Console 创建应用
3. 上传 APK 或 AAB 文件
4. 填写应用信息和截图
5. 提交审核

注意：Google Play 现在推荐使用 AAB 格式而不是 APK。可以在 Android Studio 中选择 `Build` > `Generate Signed Bundle / APK`，然后选择 `Android App Bundle`。

## 技术支持

如遇到问题，请参考以下资源：

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android Studio 文档](https://developer.android.com/studio)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
