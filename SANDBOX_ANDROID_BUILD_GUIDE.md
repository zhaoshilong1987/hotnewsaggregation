# 沙盒环境 Android APK 构建指南

## 环境配置

### 已安装的软件

1. **Java JDK 17**
   - 路径: `/usr/lib/jvm/java-17-openjdk-amd64`
   - 版本: OpenJDK 17.0.17

2. **Android SDK**
   - 路径: `/opt/android-sdk`
   - 已安装组件:
     - Platform Tools (36.0.2)
     - Android Platform 34
     - Build Tools 34.0.0

### 环境变量

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/34.0.0
```

## 项目配置

### Capacitor 版本

项目使用 **Capacitor 7.x**：
- `@capacitor/android`: 7.4.5
- `@capacitor/cli`: 7.4.5
- `@capacitor/core`: 7.4.5
- 其他插件: 7.x 版本

### Java 版本配置

修改了 `android/app/capacitor.build.gradle` 文件：
```gradle
android {
  compileOptions {
      sourceCompatibility JavaVersion.VERSION_17
      targetCompatibility JavaVersion.VERSION_17
  }
}
```

## 构建步骤

### 1. 准备 Web 资源

```bash
cd /workspace/projects
npx next build
```

### 2. 添加 Android 平台（如果还没有）

```bash
npx cap add android
```

### 3. 同步到 Android

```bash
npx cap sync android
```

### 4. 构建 Release APK（不需要签名）

```bash
cd /workspace/projects/android
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
./gradlew assembleRelease --no-daemon
```

### 5. 构建 Debug APK

```bash
cd /workspace/projects/android
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
./gradlew assembleDebug --no-daemon
```

## APK 输出位置

### Release APK
- 路径: `android/app/build/outputs/apk/release/app-release.apk`

### Debug APK
- 路径: `android/app/build/outputs/apk/debug/app-debug.apk`

## 后台构建脚本

项目提供了后台构建脚本：

```bash
chmod +x /workspace/projects/build-apk-background.sh
nohup /workspace/projects/build-apk-background.sh > /tmp/nohup.out 2>&1 &
```

查看构建状态：
```bash
tail -f /tmp/build-status.log
```

## 常见问题

### 问题 1: SDK location not found

**解决方案：**
创建 `android/local.properties` 文件：
```properties
sdk.dir=/opt/android-sdk
```

### 问题 2: Java 版本不兼容

**错误信息：**
```
error: invalid source release: 21
```

**解决方案：**
修改 `android/app/capacitor.build.gradle`，将 Java 版本改为 17：
```gradle
sourceCompatibility JavaVersion.VERSION_17
targetCompatibility JavaVersion.VERSION_17
```

### 问题 3: out 目录不存在

**解决方案：**
```bash
cd /workspace/projects
npx next build
```

## 注意事项

1. **不需要签名**：此构建配置生成了未签名的 APK，适合测试和内部分发
2. **Java 版本**：使用 Java 17，而不是 Java 21
3. **Capacitor 版本**：使用 Capacitor 7.x，兼容 Java 17
4. **构建时间**：首次构建可能需要 5-10 分钟，Gradle 需要下载依赖

## 生产环境部署

如果要发布到 Google Play，需要：

1. 生成签名密钥
2. 配置签名
3. 构建签名的 Release APK

详细步骤请参考 `ANDROID_BUILD_STEPS.md` 文档。
