#!/bin/bash

echo "=== 热榜资讯部署诊断脚本 ==="
echo ""

DOMAIN="https://hotlistnews.vercel.app"

echo "1. 检查域名 DNS 解析..."
if command -v nslookup &> /dev/null; then
    nslookup hotlistnews.vercel.app | grep -A 2 "Name:"
elif command -v dig &> /dev/null; then
    dig +short hotlistnews.vercel.app
else
    echo "  DNS 工具不可用"
fi
echo ""

echo "2. 测试 HTTP 连接..."
curl -I --max-time 10 $DOMAIN 2>&1 | head -20
echo ""

echo "3. 测试 HTTPS 连接..."
curl -I --max-time 10 --insecure $DOMAIN 2>&1 | head -20
echo ""

echo "4. 测试静态页面..."
curl -I --max-time 10 $DOMAIN/test.html 2>&1 | head -20
echo ""

echo "5. 测试 API 端点..."
curl -I --max-time 10 $DOMAIN/api/news/all 2>&1 | head -20
echo ""

echo "=== 诊断完成 ==="
