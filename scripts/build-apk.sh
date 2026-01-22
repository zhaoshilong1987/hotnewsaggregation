#!/bin/bash
set -Eeuo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Android APK 本地构建脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Java 版本
echo -e "${YELLOW}[1/6] 检查 Java 环境...${NC}"
if ! command -v java &> /dev/null; then
    echo -e "${RED}错误: 未安装 Java${NC}"
    echo "请安装 Java 21："
    echo "  - macOS: brew install openjdk@21"
    echo "  - Ubuntu: sudo apt install openjdk-21-jdk"
    echo "  - Windows: 从 https://adoptium.net/ 下载安装"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
echo -e "${GREEN}✓ Java 版本: $JAVA_VERSION${NC}"

if [ "$JAVA_VERSION" -lt 21 ]; then
    echo -e "${RED}错误: 需要 Java 21 或更高版本${NC}"
    exit 1
fi

# 检查 Node.js
echo -e "${YELLOW}[2/6] 检查 Node.js 环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未安装 Node.js${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node 版本: $NODE_VERSION${NC}"

# 检查 pnpm
echo -e "${YELLOW}[3/6] 检查 pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}错误: 未安装 pnpm${NC}"
    echo "请运行: npm install -g pnpm"
    exit 1
fi

PNPM_VERSION=$(pnpm -v)
echo -e "${GREEN}✓ pnpm 版本: $PNPM_VERSION${NC}"

# 安装依赖
echo -e "${YELLOW}[4/6] 安装项目依赖...${NC}"
pnpm install --prefer-frozen-lockfile

# 构建 Next.js
echo -e "${YELLOW}[5/6] 构建 Next.js...${NC}"
npx next build
echo -e "${GREEN}✓ Next.js 构建完成${NC}"

# 同步 Capacitor
echo -e "${YELLOW}[6/6] 同步 Capacitor 并构建 APK...${NC}"
npx cap sync android

# 进入 Android 目录构建
cd android

if [ ! -f "gradlew" ]; then
    echo -e "${RED}错误: 未找到 gradlew 文件${NC}"
    exit 1
fi

chmod +x gradlew

# 构建 Release APK
echo -e "${YELLOW}正在构建 Release APK...${NC}"
./gradlew assembleRelease --no-daemon

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  ✅ APK 构建成功！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "APK 文件位置:"
    echo -e "  ${GREEN}android/app/build/outputs/apk/release/app-release.apk${NC}"
    echo ""
    echo "你可以使用以下命令安装到设备："
    echo "  adb install android/app/build/outputs/apk/release/app-release.apk"
    echo ""
else
    echo -e "${RED}构建失败！${NC}"
    exit 1
fi
