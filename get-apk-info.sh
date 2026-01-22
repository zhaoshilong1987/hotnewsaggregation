#!/bin/bash
# APK 信息查看脚本
# 使用方法: bash /workspace/projects/get-apk-info.sh

APK_PATH="/workspace/projects/android/app/build/outputs/apk/debug/app-debug.apk"

echo "=========================================="
echo "  Android APK 信息"
echo "=========================================="
echo ""

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK 文件不存在: $APK_PATH"
    echo ""
    echo "请先运行以下命令构建 APK:"
    echo "  cd /workspace/projects/android"
    echo "  ./gradlew assembleDebug"
    exit 1
fi

echo "✅ APK 文件已找到"
echo ""
echo "📦 文件信息:"
ls -lh "$APK_PATH" | awk '{print "  大小: " $5 "\n  修改时间: " $6 " " $7 " " $8}'
echo ""

echo "📱 应用信息:"
echo "  文件路径: $APK_PATH"
echo "  文件名: $(basename $APK_PATH)"
echo ""

echo "📊 APK 内容:"
echo "  - DEX 文件: $(unzip -l $APK_PATH | grep classes.dex | wc -l) 个"
echo "  - 资源文件: $(unzip -l $APK_PATH | wc -l) 个"
echo ""

echo "🔧 快速命令:"
echo "  安装到设备: adb install $APK_PATH"
echo "  启动应用: adb shell am start -n com.hotnewsaggregation.news/.MainActivity"
echo "  卸载应用: adb uninstall com.hotnewsaggregation.news"
echo ""

echo "=========================================="
echo "  完整报告: /workspace/projects/APK_BUILD_SUCCESS_REPORT.md"
echo "=========================================="
