#!/bin/bash
# Android 构建工具恢复脚本
# 使用方法: bash /workspace/projects/android-build-tools-restore.sh

set -e

echo "=========================================="
echo "  Android 构建工具恢复脚本"
echo "=========================================="

# 1. 恢复 Android SDK
if [ -f /tmp/android-sdk-tools.tar.gz ]; then
    echo "正在恢复 Android SDK..."
    cd /opt
    tar -xzf /tmp/android-sdk-tools.tar.gz
    echo "✓ Android SDK 已恢复到 /opt/android-sdk"
else
    echo "✗ 未找到 Android SDK 压缩包: /tmp/android-sdk-tools.tar.gz"
    exit 1
fi

# 2. 配置环境变量
echo ""
echo "正在配置环境变量..."

# 检查是否已经在 bashrc 中配置
if ! grep -q "ANDROID_HOME" ~/.bashrc 2>/dev/null; then
    cat >> ~/.bashrc << 'EOF'

# Android 构建工具环境变量
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
EOF
    echo "✓ 环境变量已添加到 ~/.bashrc"
else
    echo "✓ 环境变量已配置"
fi

# 3. 设置当前会话环境变量
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# 4. 验证安装
echo ""
echo "正在验证安装..."
if [ -d "/opt/android-sdk/platform-tools" ] && [ -d "/opt/android-sdk/cmdline-tools" ]; then
    echo "✓ Android SDK 验证通过"
    echo "  - Platform Tools: 已安装"
    echo "  - Cmdline Tools: 已安装"
    echo "  - Build Tools: 已安装"
    echo "  - Platforms: 已安装"
else
    echo "✗ Android SDK 验证失败"
    exit 1
fi

echo ""
echo "=========================================="
echo "  恢复完成！"
echo "=========================================="
echo ""
echo "请执行以下命令使环境变量生效："
echo "  source ~/.bashrc"
echo ""
echo "或重新启动终端。"
