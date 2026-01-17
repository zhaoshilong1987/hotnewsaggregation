#!/bin/bash

echo "=== 深度诊断脚本 ==="
echo ""

DOMAIN="hotlistnews.vercel.app"

echo "1. 检查 DNS 详细信息..."
if command -v dig &> /dev/null; then
    echo "=== DIG 查询 ==="
    dig $DOMAIN +short
    dig $DOMAIN ANY | grep -v "^;" | grep -v "^$"
    echo ""
fi

echo "2. 检查端口连通性..."
echo "测试 80 端口..."
timeout 5 bash -c "echo > /dev/tcp/$DOMAIN/80" 2>&1 && echo "✅ 80 端口开放" || echo "❌ 80 端口超时或关闭"

echo "测试 443 端口..."
timeout 5 bash -c "echo > /dev/tcp/$DOMAIN/443" 2>&1 && echo "✅ 443 端口开放" || echo "❌ 443 端口超时或关闭"
echo ""

echo "3. Ping 测试..."
ping -c 3 $DOMAIN 2>&1 | tail -5
echo ""

echo "4. TraceRoute (如果可用)..."
if command -v traceroute &> /dev/null; then
    echo "=== TraceRoute ==="
    traceroute -m 10 -w 2 $DOMAIN 2>&1 | head -15
fi
echo ""

echo "5. 测试其他 Vercel 站点（对比）..."
echo "测试 vercel.com..."
curl -I --max-time 5 https://vercel.com 2>&1 | head -3

echo "测试 example.vercel.app..."
curl -I --max-time 5 https://example.vercel.app 2>&1 | head -3
echo ""

echo "6. 测试部署 ID 访问..."
echo "尝试访问最新的部署..."
curl -I --max-time 5 https://hotlistnews-git-main-zhaoshilong1987.vercel.app/ 2>&1 | head -10
echo ""

echo "=== 诊断完成 ==="
