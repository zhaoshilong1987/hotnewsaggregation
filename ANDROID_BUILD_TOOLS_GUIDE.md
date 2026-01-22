# Android 构建工具备份说明

## 📦 已保存的工具

以下工具已保存在 `/tmp` 目录下，下次构建 Android APK 时可以直接使用：

| 工具 | 文件路径 | 大小 | 说明 |
|------|---------|------|------|
| Android SDK | `/tmp/android-sdk-tools.tar.gz` | 420MB | 已压缩，包含 Platform Tools, Build Tools 34.0.0, Platform 34 |
| Gradle | `/tmp/gradle-8.11.1-all.zip` | 220MB | Gradle 构建工具 |
| Java 21 | 系统自带 | - | Ubuntu 系统自带，无需备份 |

## 🚀 快速恢复步骤

### 方法一：使用恢复脚本（推荐）

```bash
# 1. 运行恢复脚本
bash /workspace/projects/android-build-tools-restore.sh

# 2. 使环境变量生效
source ~/.bashrc

# 3. 验证安装
echo $ANDROID_HOME
ls -la /opt/android-sdk/
```

### 方法二：手动恢复

```bash
# 1. 恢复 Android SDK
cd /opt
tar -xzf /tmp/android-sdk-tools.tar.gz

# 2. 配置环境变量
cat >> ~/.bashrc << 'EOF'

# Android 构建工具环境变量
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
EOF

# 3. 使环境变量生效
source ~/.bashrc

# 4. 验证
echo $ANDROID_HOME
ls $ANDROID_HOME/
```

## 📋 Android SDK 已包含组件

以下组件已包含在备份中，无需重新下载：

- **Platform Tools**: 最新版
- **Build Tools**: 34.0.0
- **Platform**: Android 14 (API 34)
- **Licenses**: 已接受

## 🔨 下次构建 APK 的完整流程

```bash
# 1. 恢复工具
bash /workspace/projects/android-build-tools-restore.sh
source ~/.bashrc

# 2. 进入项目目录
cd /workspace/projects/

# 3. 安装依赖
pnpm install

# 4. 构建 Web 应用
pnpm run build

# 5. 添加 Android 平台（如果还没有）
npx cap add android

# 6. 同步 Web 资源
npx cap sync android

# 7. 构建 APK
cd android
./gradlew assembleDebug

# 8. APK 输出位置
# android/app/build/outputs/apk/debug/app-debug.apk
```

## ⚠️ 注意事项

1. **Java 版本**: 沙盒环境自带 Java 21，无需额外安装
2. **环境变量**: 每次新建终端会话都需要重新设置环境变量，或使用 `source ~/.bashrc`
3. **Gradle**: 项目使用 Gradle Wrapper，无需单独安装 Gradle
4. **磁盘空间**: Android SDK 解压后约 892MB，确保有足够空间

## 📝 故障排查

### 问题：找不到 ANDROID_HOME

**解决**：
```bash
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 问题：构建失败提示缺少 License

**解决**：
```bash
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
```

### 问题：Gradle 构建失败

**解决**：
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## 📞 相关文档

- 恢复脚本：`/workspace/projects/android-build-tools-restore.sh`
- 项目构建脚本：`/workspace/projects/build-android-apk.sh`
- 构建状态报告：`/workspace/projects/SANDBOX_BUILD_STATUS_REPORT.md`
- 完整构建指南：`/workspace/projects/SANDBOX_ANDROID_BUILD_GUIDE.md`

---

**备份时间**: 2025-01-22
**工具版本**:
- Android SDK: Platform 34, Build Tools 34.0.0
- Java: OpenJDK 21.0.9
- Gradle: 8.11.1
