# 📦 Android 构建工具备份索引

本索引包含已保存的 Android 构建工具和相关文档，方便下次直接使用。

## 📂 工具包文件位置

| 文件名 | 位置 | 大小 | 类型 | 说明 |
|--------|------|------|------|------|
| `android-sdk-tools.tar.gz` | `/workspace/projects/android-tools/` | 420MB | 压缩包 | Android SDK 完整备份（含 Platform Tools, Build Tools, Platform 34） |
| `gradle-8.11.1-all.zip` | `/workspace/projects/android-tools/` | 220MB | ZIP | Gradle 构建工具 |

## 📄 文档和脚本位置

| 文件名 | 位置 | 类型 | 说明 |
|--------|------|------|------|
| `android-build-tools-restore.sh` | `/workspace/projects/` | Shell 脚本 | 一键恢复工具脚本（已添加执行权限） |
| `ANDROID_BUILD_TOOLS_GUIDE.md` | `/workspace/projects/` | Markdown | 详细使用指南 |
| `SAVED_TOOLS_INDEX.md` | `/workspace/projects/` | Markdown | 本索引文件 |

## 🚀 快速开始

### 最快恢复方式（3步）

```bash
# 步骤1: 运行恢复脚本
bash /workspace/projects/android-build-tools-restore.sh

# 步骤2: 使环境变量生效
source ~/.bashrc

# 步骤3: 验证安装
echo $ANDROID_HOME
ls -la /opt/android-sdk/
```

### 手动恢复

```bash
# 1. 解压 Android SDK
cd /opt
tar -xzf /workspace/projects/android-tools/android-sdk-tools.tar.gz

# 2. 设置环境变量
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 3. 验证
ls -la /opt/android-sdk/
```

## 📚 文档导航

- **详细指南**: 查看 [ANDROID_BUILD_TOOLS_GUIDE.md](ANDROID_BUILD_TOOLS_GUIDE.md)
  - 完整恢复步骤
  - 环境配置说明
  - 故障排查方法
  - APK 构建完整流程

## 💾 占用空间

- **压缩后**: 约 640MB（Android SDK 420MB + Gradle 220MB）
- **解压后**: 约 1.1GB（Android SDK 892MB + Gradle）

## ⏰ 备份信息

- **备份时间**: 2025-01-22
- **工具版本**:
  - Android SDK: Platform 34, Build Tools 34.0.0
  - Java: OpenJDK 21.0.9（系统自带）
  - Gradle: 8.11.1

## 🔗 相关资源

- **项目根目录**: `/workspace/projects/`
- **项目构建脚本**: `/workspace/projects/build-android-apk.sh`
- **构建状态报告**: `/workspace/projects/SANDBOX_BUILD_STATUS_REPORT.md`
- **完整构建指南**: `/workspace/projects/SANDBOX_ANDROID_BUILD_GUIDE.md`

## 📝 下次使用清单

下次需要构建 Android APK 时，按照以下步骤操作：

1. ✅ 恢复工具：`bash /workspace/projects/android-build-tools-restore.sh`
2. ✅ 设置环境：`source ~/.bashrc`
3. ✅ 构建应用：`cd /workspace/projects && pnpm install && pnpm run build`
4. ✅ 同步资源：`npx cap sync android`
5. ✅ 生成APK：`cd android && ./gradlew assembleDebug`

---

**提示**:
- 所有工具文件保存在 `/tmp` 目录下
- 所有脚本和文档保存在 `/workspace/projects/` 目录下
- 恢复脚本已添加执行权限，可直接运行
- 如需持久化保存，建议将文件上传到对象存储或下载到本地
