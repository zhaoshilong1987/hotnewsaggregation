# 📦 Android 构建工具备份索引

本目录包含已保存的 Android 构建工具和相关文档，方便下次直接使用。

## 📂 文件清单

### 🛠️ 工具包文件

| 文件名 | 大小 | 类型 | 说明 |
|--------|------|------|------|
| `android-sdk-tools.tar.gz` | 420MB | 压缩包 | Android SDK 完整备份（含 Platform Tools, Build Tools, Platform 34） |
| `gradle-8.11.1-all.zip` | 220MB | ZIP | Gradle 构建工具 |

### 📄 文档和脚本

| 文件名 | 类型 | 说明 |
|--------|------|------|
| `android-build-tools-restore.sh` | Shell 脚本 | 一键恢复工具脚本 |
| `ANDROID_BUILD_TOOLS_GUIDE.md` | Markdown | 详细使用指南 |
| `SAVED_TOOLS_INDEX.md` | Markdown | 本索引文件 |

## 🚀 快速开始

### 最快恢复方式

```bash
# 1. 解压 Android SDK
cd /opt
tar -xzf /tmp/android-sdk-tools.tar.gz

# 2. 设置环境变量
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 3. 验证
ls -la /opt/android-sdk/
```

### 使用恢复脚本

```bash
bash /tmp/android-build-tools-restore.sh
source ~/.bashrc
```

## 📚 文档导航

- **详细指南**: [ANDROID_BUILD_TOOLS_GUIDE.md](ANDROID_BUILD_TOOLS_GUIDE.md)
  - 完整恢复步骤
  - 环境配置说明
  - 故障排查方法
  - APK 构建完整流程

## 💾 占用空间

- **压缩后**: 约 640MB
- **解压后**: 约 1.1GB（Android SDK 892MB + Gradle）

## ⏰ 备份信息

- **备份时间**: 2025-01-22
- **工具版本**:
  - Android SDK: Platform 34, Build Tools 34.0.0
  - Java: OpenJDK 21.0.9（系统自带）
  - Gradle: 8.11.1

## 🔗 相关资源

- 项目根目录: `/workspace/projects/`
- 项目构建脚本: `/workspace/projects/build-android-apk.sh`
- 构建状态报告: `/workspace/projects/SANDBOX_BUILD_STATUS_REPORT.md`

---

**提示**: 所有文件保存在 `/tmp` 目录下，重启后仍可使用。如需持久化保存，建议上传到对象存储或下载到本地。
