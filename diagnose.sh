#!/bin/bash

echo "=========================================="
echo "  Vercel 网站诊断脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试域名
DOMAIN="hotlistnews.vercel.app"

echo "1. 测试域名: $DOMAIN"
echo "------------------------------------------"

# DNS 查询
echo -n "DNS 解析: "
if command -v dig &> /dev/null; then
    DIG_RESULT=$(dig +short $DOMAIN)
    if [ -n "$DIG_RESULT" ]; then
        echo -e "${GREEN}✓ 成功${NC}"
        echo "  IP 地址: $DIG_RESULT"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
elif command -v nslookup &> /dev/null; then
    NSLOOKUP_RESULT=$(nslookup $DOMAIN 2>&1 | grep "Address:" | tail -1)
    if [ -n "$NSLOOKUP_RESULT" ]; then
        echo -e "${GREEN}✓ 成功${NC}"
        echo "  $NSLOOKUP_RESULT"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
else
    echo -e "${YELLOW}⚠ 无法测试（没有 dig/nslookup）${NC}"
fi

echo ""

# Ping 测试
echo -n "Ping 测试: "
if command -v ping &> /dev/null; then
    PING_RESULT=$(ping -c 1 -W 2 $DOMAIN 2>&1)
    if echo "$PING_RESULT" | grep -q "1 received"; then
        echo -e "${GREEN}✓ 成功${NC}"
        PING_TIME=$(echo "$PING_RESULT" | grep "time=" | awk '{print $7}' | cut -d'=' -f2)
        echo "  响应时间: ${PING_TIME}"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
else
    echo -e "${YELLOW}⚠ 无法测试（没有 ping）${NC}"
fi

echo ""

# HTTP 连接测试
echo "2. HTTP 连接测试"
echo "------------------------------------------"

# HTTPS 测试
echo -n "HTTPS 连接: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN --max-time 5 2>&1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ 成功 (200)${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}✗ 连接失败${NC}"
else
    echo -e "${YELLOW}⚠ 返回 ${HTTP_CODE}${NC}"
fi

echo ""

# HTTP 测试（如果有问题）
echo -n "HTTP 连接: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN --max-time 5 2>&1)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ 成功 (200)${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}✗ 连接失败${NC}"
else
    echo -e "${YELLOW}⚠ 返回 ${HTTP_CODE}${NC}"
fi

echo ""

# HEAD 请求测试
echo "3. HEAD 请求测试"
echo "------------------------------------------"
HEADERS=$(curl -I -s -m 5 https://$DOMAIN 2>&1)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ HEAD 请求成功${NC}"
    echo ""
    echo "响应头："
    echo "$HEADERS" | head -10
else
    echo -e "${RED}✗ HEAD 请求失败${NC}"
fi

echo ""

# 测试静态页面
echo "4. 测试静态页面"
echo "------------------------------------------"

TEST_PAGES=("/", "/index.html", "/test.html")

for page in "${TEST_PAGES[@]}"; do
    echo -n "  https://${DOMAIN}${page}: "
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN$page --max-time 5 2>&1)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ 可访问${NC}"
    else
        echo -e "${RED}✗ ${HTTP_CODE}${NC}"
    fi
done

echo ""

# Git 状态
echo "5. Git 状态"
echo "------------------------------------------"
if [ -d ".git" ]; then
    echo -n "Git 仓库: "
    echo -e "${GREEN}✓ 存在${NC}"

    echo -n "分支: "
    git branch --show-current

    echo -n "最新 commit: "
    git log -1 --oneline

    echo -n "远程状态: "
    STATUS=$(git status --short --branch | head -1)
    echo "$STATUS"
else
    echo -e "${YELLOW}⚠ 不是 Git 仓库${NC}"
fi

echo ""

# 诊断总结
echo "=========================================="
echo "  诊断总结"
echo "=========================================="
echo ""
echo "如果所有测试都失败，可能是："
echo "  1. 网络连接问题"
echo "  2. DNS 解析问题"
echo "  3. Vercel 项目不存在或已暂停"
echo "  4. 防火墙阻止了连接"
echo ""
echo "建议操作："
echo "  1. 检查网络连接"
echo "  2. 访问 https://vercel.com/dashboard 检查项目状态"
echo "  3. 使用 Vercel CLI 直接部署: vercel --prod"
echo ""
