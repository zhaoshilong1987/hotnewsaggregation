#!/bin/bash
# 简化的 Android APK 构建脚本

# 设置环境变量
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=/opt/android-sdk

cd /workspace/projects/android

# 清理旧构建
echo "清理旧构建..."
rm -rf app/build

# 构建 Release APK
echo "开始构建 Release APK..."
./gradlew assembleRelease --no-daemon --stacktrace 2>&1 | tee /tmp/gradle-build.log

# 检查构建结果
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "APK 信息："
    ls -lh app/build/outputs/apk/release/app-release.apk
    echo ""
    echo "APK 位置："
    echo "  /workspace/projects/android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    exit 0
else
    echo ""
    echo "❌ 构建失败！"
    echo ""
    echo "查看完整日志："
    echo "  tail -100 /tmp/gradle-build.log"
    echo ""
    exit 1
fi
