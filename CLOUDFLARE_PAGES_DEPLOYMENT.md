# Cloudflare Pages 部署指南

## 🚀 快速开始

### 方案一：通过 Cloudflare 控制台连接 GitHub（推荐）

这是最简单的方式，无需手动配置 GitHub Actions。

#### 步骤 1：连接 GitHub 仓库

1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/853df887c6c8d748258df3b53c837636/pages)
2. 点击 **"创建项目"** → **"连接到 Git"**
3. 授权 Cloudflare 访问你的 GitHub 账号
4. 选择仓库：`zhaoshilong1987/hotnewsaggregation`

#### 步骤 2：配置构建设置

在 "设置构建设置" 中填写：

| 配置项 | 值 |
|--------|-----|
| **框架预设** | Next.js |
| **构建命令** | `pnpm run pages:build` |
| **构建输出目录** | `.vercel/output/static` |
| **Node.js 版本** | `20` |

#### 步骤 3：环境变量（可选）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_VERSION` | `20` | Node.js 版本 |

#### 步骤 4：保存并部署

1. 点击 **"保存并部署"**
2. 等待 2-3 分钟，部署完成后会获得访问地址

---

### 方案二：使用 GitHub Actions 自动部署

如果你希望通过 GitHub Actions 自动部署，需要配置 Secrets。

#### 步骤 1：获取 Cloudflare 凭证

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 获取 **Account ID**：
   - 在右侧边栏找到 "Account ID" 并复制

3. 创建 API Token：
   - 访问 https://dash.cloudflare.com/profile/api-tokens
   - 点击 "创建令牌"
   - 选择 "编辑 Cloudflare Workers" 模板
   - 权限配置：
     - Account - Cloudflare Pages - Edit
     - Zone - Zone - Read (可选)
   - 点击 "继续以显示摘要" → "创建令牌"
   - **复制并保存 token**（只显示一次）

#### 步骤 2：配置 GitHub Secrets

1. 访问你的 GitHub 仓库：https://github.com/zhaoshilong1987/hotnewsaggregation/settings/secrets/actions
2. 添加以下 Secrets：

| Secret 名称 | 值 |
|-------------|-----|
| `CLOUDFLARE_API_TOKEN` | 刚创建的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Account ID |
| `GITHUB_TOKEN` | 自动提供，无需配置 |

#### 步骤 3：触发部署

- 推送代码到 `main` 分支会自动触发部署
- 或在 GitHub Actions 页面手动运行 workflow

---

## 📁 项目配置文件

### wrangler.toml
```toml
name = "hot-news-aggregation"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"

[vars]
NODE_VERSION = "20"
```

### .github/workflows/cloudflare-pages.yml
已配置 GitHub Actions 自动部署工作流。

---

## ✅ 部署验证

部署完成后，访问以下 URL 检查：

- 主页：`https://hot-news-aggregation.pages.dev`（实际 URL 以 Cloudflare 提供为准）
- 404 页面：`https://hot-news-aggregation.pages.dev/404`
- API 路由：`https://hot-news-aggregation.pages.dev/api/platforms`

---

## 🔄 本地开发

使用 wrangler 进行本地开发：

```bash
# 构建项目
pnpm run pages:build

# 本地预览（端口 8788）
pnpm run pages:dev
```

---

## 🛠️ 常见问题

### 1. 构建失败

检查：
- Node.js 版本是否为 20.x
- 依赖是否正确安装
- 构建输出目录是否为 `.vercel/output/static`

### 2. API 路由不可用

Cloudflare Pages 使用 Edge Runtime，确保 API 路由使用 `export const runtime = 'edge'`。

### 3. 静态资源 404

检查 `next.config.ts` 中是否设置了 `unoptimized: true`。

---

## 📞 技术支持

- Cloudflare Pages 文档：https://developers.cloudflare.com/pages/
- @cloudflare/next-on-pages：https://github.com/cloudflare/next-on-pages
