# GitHub Actions 构建指南

## 📱 自动构建 Android APK

本项目配置了 GitHub Actions 工作流，可以自动构建生产版本的 Android APK 和 AAB（用于 Google Play）。

## 🚀 触发方式

### 1. 自动触发
- **推送到 main/master 分支**：触发 APK 构建
- **创建 Tag（v*）**：同时触发 APK 和 AAB 构建
- **Pull Request 到 main/master**：触发测试构建

### 2. 手动触发
在 GitHub Actions 页面选择 "Build Android APK" 工作流，点击 "Run workflow" 按钮。

## 📦 下载构建产物

### 方法 1：从 Actions 页面下载
1. 进入 GitHub 仓库的 "Actions" 标签页
2. 选择一个成功的工作流运行
3. 滚动到底部，找到 "Artifacts" 部分
4. 下载 `app-release`（APK）或 `app-release-bundle`（AAB）

### 方法 2：使用 GitHub CLI
```bash
gh run download <run-id> -n app-release
```

## 🔐 配置应用签名（可选）

如果你需要发布到应用商店，需要配置签名密钥。

### 1. 生成密钥库
```bash
keytool -genkey -v -keystore your-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias your-key-alias
```

### 2. 在 GitHub Secrets 中配置
进入 GitHub 仓库 Settings → Secrets and variables → Actions，添加以下 Secrets：

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `KEYSTORE_FILE` | Base64 编码的 keystore 文件 | `base64 -w 0 your-keystore.jks` |
| `KEYSTORE_PASSWORD` | Keystore 密码 | `your-password` |
| `KEY_ALIAS` | 密钥别名 | `your-key-alias` |
| `KEY_PASSWORD` | 密钥密码 | `your-key-password` |

### 3. 修改 Android 构建配置

在 `android/app/build.gradle` 中配置签名：

```gradle
android {
    signingConfigs {
        release {
            if (System.getenv("KEYSTORE_FILE")) {
                storeFile file(System.getenv("KEYSTORE_FILE"))
                storePassword System.getenv("KEYSTORE_PASSWORD")
                keyAlias System.getenv("KEY_ALIAS")
                keyPassword System.getenv("KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 🔧 构建流程说明

GitHub Actions 工作流执行以下步骤：

1. **检出代码**：获取最新代码
2. **设置 Java 21**：安装和配置 Java 环境
3. **设置 Node.js**：安装 Node.js 20
4. **安装依赖**：使用 pnpm 安装项目依赖
5. **构建 Next.js**：生成静态网站文件
6. **同步 Capacitor**：将 Web 代码同步到 Android 项目
7. **构建 APK/AAB**：使用 Gradle 构建原生应用
8. **上传产物**：将构建结果上传为 Artifacts

## 📝 环境变量

工作流中使用的环境变量：

- `JAVA_VERSION`: Java 版本（默认 21）
- `NODE_VERSION`: Node.js 版本（默认 20）

可以在 `.github/workflows/build-android.yml` 中修改。

## 🐛 故障排查

### 构建失败

1. **检查依赖安装**：确保 `pnpm-lock.yaml` 文件存在且无冲突
2. **查看日志**：在 Actions 运行页面查看详细错误日志
3. **Java 版本**：确保使用 Java 21（Capacitor 7.x 要求）
4. **Android SDK**：自动安装，无需手动配置

### APK 无法安装

1. **检查签名**：生产环境建议使用签名配置
2. **权限问题**：确保应用在 `android/app/src/main/AndroidManifest.xml` 中声明了必要权限
3. **Web 代码**：确保 Next.js 构建成功，并且 `capacitor.config.ts` 配置正确

## 🎯 发布到 Google Play

1. 创建 Git tag：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. GitHub Actions 自动构建 AAB 文件

3. 下载 AAB 文件并上传到 [Google Play Console](https://play.google.com/console)

## 📊 构建时间

典型构建时间：
- **首次构建**：约 5-8 分钟（需要下载依赖和缓存）
- **后续构建**：约 3-5 分钟（利用缓存）

## 🔗 相关链接

- [Capacitor Android 文档](https://capacitorjs.com/docs/android)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Next.js 构建文档](https://nextjs.org/docs/deployment)
