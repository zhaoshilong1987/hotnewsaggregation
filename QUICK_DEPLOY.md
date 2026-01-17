# 🚀 快速部署方案

如果 `git push` 无法使用，这里有 3 个替代方案：

## 方案 1：使用 Vercel CLI 直接部署（最简单）

### 步骤 1：安装并登录 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login
```

### 步骤 2：直接部署

```bash
# 从沙盒目录部署
cd /workspace/projects

# 部署到生产环境
vercel --prod
```

这个命令会：
1. 自动上传代码到 Vercel
2. 在 Vercel 服务器上构建
3. 部署到生产环境

### 步骤 3：等待部署完成

部署完成后，Vercel CLI 会显示：
```
✅ Production: https://hotlistnews.vercel.app [2m 30s]
```

然后访问：https://hotlistnews.vercel.app

---

## 方案 2：手动在 GitHub 网页修改配置

### 步骤 1：访问 GitHub 仓库

```
https://github.com/YOUR_USERNAME/YOUR_REPO
```

### 步骤 2：修改 next.config.ts

1. 找到并点击 `next.config.ts` 文件
2. 点击右上角的 ✏️ 铅笔图标
3. 删除这一行：
   ```typescript
   swcMinify: true,
   ```
4. 在页面底部的 "Commit changes" 输入描述：
   ```
   fix: 移除 swcMinify 配置
   ```
5. 点击 "Commit changes" 按钮

### 步骤 3：等待 Vercel 自动部署

推送后会自动触发部署，等待 2-3 分钟。

---

## 方案 3：重新创建 Vercel 项目

如果以上方法都不行，可以重新创建项目。

### 步骤 1：登录 Vercel

访问：https://vercel.com/dashboard

### 步骤 2：创建新项目

1. 点击 "Add New" → "Project"
2. 如果已连接 GitHub，直接导入仓库
3. 如果没有连接，先连接 GitHub 账号

### 步骤 3：配置项目

确保配置如下：

```
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm run build
Output Directory: (留空)
Install Command: pnpm install
Node.js Version: 18.x
```

### 步骤 4：部署

点击 "Deploy" 按钮，等待部署完成。

---

## 🧪 测试部署

部署完成后，依次测试：

### 1. 测试静态页面（应该能立即打开）
```
https://hotlistnews.vercel.app/test.html
```

### 2. 测试静态首页
```
https://hotlistnews.vercel.app/index.html
```

### 3. 测试主应用
```
https://hotlistnews.vercel.app
```

---

## 🔍 如果还是打不开

### 检查 Vercel 项目状态

1. 登录 https://vercel.com/dashboard
2. 进入项目
3. 查看以下信息：

#### Dashboard 标签
- 项目状态：✅ Ready / ❌ Error / ⏸️ Stopped

#### Deployments 标签
- 最新部署状态：✅ Ready / ❌ Error
- 如果是 Error，点击查看日志

#### Settings → Domains
- `hotlistnews.vercel.app` 状态：✅ Valid / ❌ Error

### 常见问题

#### 问题 1：项目不存在
- 可能 Vercel 项目被删除了
- 需要重新创建项目

#### 问题 2：部署失败
- 查看 Build Logs
- 常见原因：
  - 构建命令错误
  - 依赖安装失败
  - 代码语法错误

#### 问题 3：域名配置错误
- 删除现有域名
- 重新添加 `hotlistnews.vercel.app`
- 等待 DNS 生效（5-10 分钟）

---

## 💡 推荐方案

**最简单的方法**：使用方案 1（Vercel CLI）

```bash
npm install -g vercel
vercel login
cd /workspace/projects
vercel --prod
```

这样不需要 Git，直接从沙盒部署到 Vercel。

---

## 📞 需要帮助？

如果尝试以上方案后仍然无法解决，请提供：

1. Vercel Dashboard 的截图
2. Deployments 标签的截图
3. Build Logs 的错误信息
4. 访问 `https://hotlistnews.vercel.app/test.html` 的结果

---

**预计解决时间**：使用 Vercel CLI 部署约 3-5 分钟
