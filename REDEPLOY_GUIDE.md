# 重新部署指南

## 快速重新部署（推荐）

### 方法 1：Vercel 控制台直接重部署
1. 访问：https://vercel.com/dashboard
2. 点击"热榜资讯"项目
3. 点击"Redeploy"按钮
4. 等待部署完成

### 方法 2：通过 Git 推送触发
```bash
# 提交当前修复
git add .
git commit -m "fix: 修复 Vercel 部署问题 - 移除不兼容配置并添加超时保护"
git push origin main
```

## 本次修复内容

### 1. 修复 Next.js 配置错误
- 移除 `next.config.ts` 中 Next.js 16 不支持的 `swcMinify` 配置项

### 2. 添加前端超时保护
- `fetchHotNews()`: 添加 10 秒超时控制
- `fetchLatestNews()`: 添加 10 秒超时控制
- `loadPlatformConfig()`: 添加 5 秒超时控制

### 3. 优化加载策略
- 默认使用 Mock 数据加载，避免首次访问超时
- API 超时后自动降级到 Mock 数据
- 用户可在设置中切换到真实 API

### 4. 创建静态兜底页面
- `public/index.html` - 不依赖 Next.js 构建的静态页面
- `public/test.html` - 简单测试页面

## 验证部署

部署完成后，访问以下 URL 验证：

1. 主页面：`https://你的域名.vercel.app`
2. 测试页面：`https://你的域名.vercel.app/test.html`

## 如果仍然无法访问

### 1. 检查部署日志
- 进入 Vercel 项目页面
- 点击 "Deployments" 标签
- 查看最新部署的日志

### 2. 检查域名配置
- 确认 DNS 解析是否正确
- 确认 SSL 证书是否有效

### 3. 使用诊断脚本
```bash
# 在本地运行诊断
chmod +x diagnose.sh
./diagnose.sh
```

### 4. 联系 Vercel 支持
- 访问：https://vercel.com/support
- 提供项目 ID 和部署日志

## 常见问题

### Q: 部署失败
A: 查看部署日志，检查是否还有其他错误

### Q: 部署成功但无法访问
A: 可能是 DNS 缓存问题，等待 5-10 分钟后重试

### Q: 页面加载慢
A: 正常现象，首次加载 Mock 数据，后续可切换到真实 API

## 相关文档

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 完整故障排除指南
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 快速部署指南
- [DIAGNOSTIC_CHECKLIST.md](./DIAGNOSTIC_CHECKLIST.md) - 诊断清单
