# Android 构建工具包

本目录包含 Android APK 构建所需的工具包。

## 📦 文件清单

| 文件名 | 大小 | 说明 |
|--------|------|------|
| `android-sdk-tools.tar.gz` | 420MB | Android SDK 压缩包（Platform 34, Build Tools 34.0.0） |
| `gradle-8.11.1-all.zip` | 220MB | Gradle 构建工具 |

## 🚀 快速使用

### 方法一：使用恢复脚本（推荐）

```bash
# 在项目根目录运行
bash /workspace/projects/android-build-tools-restore.sh
source ~/.bashrc
```

### 方法二：手动恢复

```bash
# 解压 Android SDK
cd /opt
tar -xzf /workspace/projects/android-tools/android-sdk-tools.tar.gz

# 设置环境变量
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# 验证
ls -la /opt/android-sdk/
```

## 📚 更多信息

- **详细使用指南**: `/workspace/projects/ANDROID_BUILD_TOOLS_GUIDE.md`
- **恢复脚本**: `/workspace/projects/android-build-tools-restore.sh`
- **备份索引**: `/workspace/projects/SAVED_TOOLS_INDEX.md`

## ⚠️ 注意事项

- 需要系统自带 Java 21（沙盒环境已包含）
- 解压后 Android SDK 占用约 892MB
- 每次构建前需要确保环境变量已设置

## 📝 工具版本信息

- **Android SDK**: Platform 34, Build Tools 34.0.0
- **Gradle**: 8.11.1
- **Java**: OpenJDK 21.0.9

---
*备份时间: 2025-01-22*
