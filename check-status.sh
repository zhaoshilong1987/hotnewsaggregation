#!/bin/bash

echo "================================"
echo "Vercel 部署状态检查"
echo "================================"
echo ""

echo "1. 检查 Git 状态"
echo "----------------"
git status
echo ""

echo "2. 检查待推送的 commit"
echo "----------------------"
git log origin/main..HEAD --oneline
echo ""

echo "3. 检查最新 commit"
echo "------------------"
git log -1 --oneline
echo ""

echo "4. 检查远程仓库地址"
echo "------------------"
git remote -v
echo ""

echo "================================"
echo "检查完成"
echo "================================"
echo ""
echo "如果显示 'Your branch is ahead of origin/main'，"
echo "说明有 commit 未推送到 GitHub。"
echo ""
echo "推送命令："
echo "git push https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git main"
echo ""
