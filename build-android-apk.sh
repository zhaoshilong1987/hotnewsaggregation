#!/bin/bash

# 沙盒环境构建 Android APK 脚本
# 不需要数字签名

# 设置环境变量
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/34.0.0

# 验证环境
echo "=== 环境验证 ==="
echo "JAVA_HOME: $JAVA_HOME"
echo "ANDROID_HOME: $ANDROID_HOME"
java -version
echo ""

# 检查 out 目录
echo "=== 检查 out 目录 ==="
if [ ! -d "out" ]; then
    echo "错误: out 目录不存在"
    echo "请先运行: npx next build"
    exit 1
fi
ls -la out | head -5
echo ""

# 添加 Android 平台（如果不存在）
echo "=== 添加 Android 平台 ==="
if [ ! -d "android" ]; then
    npx cap add android
else
    echo "Android 平台已存在"
fi
echo ""

# 同步到 Android
echo "=== 同步到 Android ==="
npx cap sync android
echo ""

# 构建 Release APK（不需要签名）
echo "=== 构建 Release APK（不需要签名） ==="
cd android

# 修改 build.gradle 以禁用签名要求
if [ -f "app/build.gradle" ]; then
    # 备份原文件
    cp app/build.gradle app/build.gradle.bak

    # 修改 release buildType，禁用签名
    sed -i 's/signingConfig signingConfigs\.release/signingConfig null/g' app/build.gradle
    sed -i 's/minifyEnabled true/minifyEnabled false/g' app/build.gradle
    sed -i 's/shrinkResources true/shrinkResources false/g' app/build.gradle
fi

# 构建 Release APK
./gradlew assembleRelease --no-daemon

# 恢复原配置
if [ -f "app/build.gradle.bak" ]; then
    mv app/build.gradle.bak app/build.gradle
fi

echo ""
echo "=== 构建完成 ==="
ls -lh app/build/outputs/apk/release/
