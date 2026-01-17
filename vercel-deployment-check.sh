#!/bin/bash

echo "=== Vercel 部署检查脚本 ==="
echo ""

echo "1. 检查 DNS 解析..."
echo "   域名: hotnewsaggregation.vercel.app"
nslookup hotnewsaggregation.vercel.app 2>&1 | grep "Address" | grep -v "100.96.0.2"
echo ""

echo "2. 测试 IPv4 连接..."
curl -I --max-time 10 https://hotnewsaggregation.vercel.app/ 2>&1 | grep -E "HTTP|curl|failed"
echo ""

echo "3. 测试 IPv6 连接..."
curl -I --max-time 10 -6 https://hotnewsaggregation.vercel.app/ 2>&1 | grep -E "HTTP|curl|failed"
echo ""

echo "4. 检查 Vercel 主站..."
curl -I --max-time 10 https://vercel.com/ 2>&1 | grep "HTTP"
echo ""

echo "5. 建议的解决方案："
echo "   - 如果 DNS 解析返回 Twitter/X 的 IP (104.244.43.x)，这是 DNS 污染"
echo "   - 尝试使用 VPN 或更换 DNS 服务器（如 8.8.8.8、1.1.1.1）"
echo "   - 等待 5-10 分钟让 DNS 传播完成"
echo "   - 在 Vercel Dashboard 检查部署状态："
echo "     https://vercel.com/zhaoshilong1987/hotnewsaggregation"
echo ""

echo "=== 检查完成 ==="
