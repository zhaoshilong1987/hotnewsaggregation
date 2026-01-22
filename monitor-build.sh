#!/bin/bash
# 构建监控脚本

echo "开始监控 Android APK 构建..."
echo ""

# 检查构建进程
while true; do
    GRADLE_COUNT=$(ps aux | grep -E "gradlew|gradle" | grep -v grep | wc -l)
    
    if [ "$GRADLE_COUNT" -gt 0 ]; then
        echo "$(date '+%H:%M:%S') - Gradle 进程数: $GRADLE_COUNT，构建中..."
        
        # 检查是否有 APK 生成
        if [ -f "/workspace/projects/android/app/build/outputs/apk/release/app-release.apk" ]; then
            echo ""
            echo "✅ 构建成功！APK 已生成："
            ls -lh /workspace/projects/android/app/build/outputs/apk/release/app-release.apk
            exit 0
        fi
        
        # 检查是否有构建失败
        if grep -q "BUILD FAILED" /tmp/gradle-build.log 2>/dev/null; then
            echo ""
            echo "❌ 构建失败！查看日志："
            tail -50 /tmp/gradle-build.log
            exit 1
        fi
    else
        echo "$(date '+%H:%M:%S') - 无 Gradle 进程，构建已完成或未开始"
        
        # 检查是否有 APK
        if [ -f "/workspace/projects/android/app/build/outputs/apk/release/app-release.apk" ]; then
            echo ""
            echo "✅ APK 已存在："
            ls -lh /workspace/projects/android/app/build/outputs/apk/release/app-release.apk
            exit 0
        else
            echo ""
            echo "⚠️  构建已完成但未找到 APK"
            exit 1
        fi
    fi
    
    sleep 10
done
