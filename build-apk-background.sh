#!/bin/bash
# 后台构建 Android APK 脚本

cd /workspace/projects/android
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

echo "开始构建 Release APK..." > /tmp/build-status.log
date >> /tmp/build-status.log

./gradlew assembleRelease --no-daemon > /tmp/build-output.log 2>&1

if [ $? -eq 0 ]; then
    echo "构建成功！" >> /tmp/build-status.log
    ls -lh app/build/outputs/apk/release/ >> /tmp/build-status.log
    echo "APK 位置：" >> /tmp/build-status.log
    ls -1 app/build/outputs/apk/release/*.apk >> /tmp/build-status.log
else
    echo "构建失败！" >> /tmp/build-status.log
    tail -100 /tmp/build-output.log >> /tmp/build-status.log
fi

date >> /tmp/build-status.log
