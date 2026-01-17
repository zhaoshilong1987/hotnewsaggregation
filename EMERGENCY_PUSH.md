# 🚨 紧急修复：Vercel 部署问题

## 问题原因

**Next.js 配置错误导致构建失败**

`next.config.ts` 中使用了不支持的 `swcMinify` 配置项，导致 Vercel 构建失败，所以网页打不开。

## ✅ 已修复

- ❌ 移除 `swcMinify: true` 配置
- ✅ TypeScript 类型检查通过
- ✅ 代码已 commit 到本地

## 🚀 立即推送（5 分钟解决）

### 方法 1：使用 GitHub Token（推荐）

```bash
git push https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git main
```

### 方法 2：使用 SSH（如果已配置）

```bash
git push
```

### 方法 3：临时方案（如果没有 Token）

1. 登录 GitHub
2. 进入仓库 → Settings → Deploy keys
3. 或者使用 GitHub Actions 手动触发

## 📊 推送后预期

| 步骤 | 时间 | 状态 |
|------|------|------|
| Git push | 1 分钟 | ✅ 完成 |
| Vercel 检测 | 1 分钟 | ✅ 自动触发 |
| 构建部署 | 2-3 分钟 | ✅ 成功 |
| 访问测试 | < 1 秒 | ✅ 打开 |

## 🔍 验证步骤

1. **推送代码**
   ```bash
   git push https://ghp_xxxxxxxxxx@github.com/yourname/hotlistnews.git main
   ```

2. **等待 2-3 分钟**

3. **访问网站**
   ```
   https://hotlistnews.vercel.app
   ```

4. **应该看到**：
   - 页面在 < 1 秒内加载
   - 显示 mock 数据（默认）
   - 可以在设置中切换到真实 API

## 📱 如果还是打不开

### 备用页面
```
https://hotlistnews.vercel.app/simple
```

### 查看部署日志

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)
2. 进入项目 → Deployments
3. 点击最新部署记录
4. 查看 Build Logs
5. 如果有错误，截图发给我

### 检查构建命令

确保 `.coze` 文件配置正确：
```toml
[deploy]
build = ["bash","./scripts/build.sh"]
run = ["bash","./scripts/start.sh"]
```

## 🎯 现在就做

**第 1 步**：生成 GitHub Personal Access Token
- 访问：https://github.com/settings/tokens
- 点击 Generate new token (classic)
- 勾选 repo 权限
- 复制 token

**第 2 步**：推送代码
```bash
git push https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git main
```

**第 3 步**：等待 3 分钟后访问网站

---

**预计解决时间**：5 分钟内完成
