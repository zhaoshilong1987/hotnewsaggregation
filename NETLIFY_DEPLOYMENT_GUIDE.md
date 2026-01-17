# Netlify 部署指南

## 为什么选择 Netlify？

经过测试，发现 Cloudflare Pages 与 Next.js 16 的兼容性存在问题：

### Cloudflare Pages 的问题
1. **API 路由不兼容**：
   - Cloudflare Pages 要求所有 API 路由使用 Edge Runtime
   - 当前 API 路由使用了 Node.js 文件系统（`fs` 模块）
   - Edge Runtime 不支持 `fs` 模块

2. **版本不匹配**：
   - Next.js 16.1.1
   - @cloudflare/next-on-pages 要求 Next.js <= 15.5.2

3. **需要大量代码修改**：
   - 重构所有 API 路由
   - 使用 Cloudflare KV 或 D1 替代文件系统
   - 测试所有功能

### Netlify 的优势
✅ **原生支持 Next.js 16**
✅ **API 路由无需修改**
✅ **操作简单，一键导入**
✅ **完全免费**
✅ **自动 HTTPS**

---

## 快速部署步骤

### 步骤 1：访问 Netlify

1. 打开 [Netlify](https://app.netlify.com/)
2. 注册或登录账号（支持 GitHub、GitLab、Bitbucket 登录）

### 步骤 2：创建新站点

1. 点击 **"Add new site"** → **"Import from GitHub"**
2. 授权 Netlify 访问你的 GitHub 账号
3. 选择仓库：`zhaoshilong1987/hotnewsaggregation`

### 步骤 3：配置构建设置

在 "Build & deploy" 配置页面，设置：

| 配置项 | 值 |
|--------|-----|
| **Build command** | `pnpm run build` |
| **Publish directory** | `.next` |
| **Branch** | `main` |

### 步骤 4：环境变量（可选）

如果需要配置环境变量，在 "Environment variables" 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_VERSION` | `18` | Node.js 版本 |

### 步骤 5：部署

1. 点击 **"Deploy site"**
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后，获得域名：
   ```
   https://hotnewsaggregation.netlify.app
   ```

---

## 预期的构建输出

成功构建后，你应该看到：

```
✓ Building the project
✓ Running TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Site successfully deployed!
```

---

## 验证部署

### 1. 访问网站

在浏览器中打开：
```
https://hotnewsaggregation.netlify.app
```

### 2. 检查功能

✅ 网站首页正常加载
✅ 平台标签显示（微博、知乎、抖音等）
✅ 热榜数据加载（默认使用 Mock 数据）
✅ 移动端适配正常
✅ 橙色主题色
✅ 无滚动条设计

### 3. 测试 API

在浏览器控制台测试 API：

```javascript
// 测试平台列表
fetch('/api/platforms').then(r => r.json()).then(console.log)

// 测试热榜数据（微博）
fetch('/api/news/weibo').then(r => r.json()).then(console.log)
```

---

## 常见问题

### Q1: 构建失败，提示找不到 pnpm

**解决方案：**

在 Netlify 项目设置中添加环境变量：
```
NODE_VERSION = 18
```

或者使用 npm 作为包管理器：
```
Build command: npm install && npm run build
```

### Q2: 图片显示异常

**原因：** Netlify 默认图片优化与 Next.js 冲突

**解决方案：**

在项目根目录创建 `netlify.toml` 文件：

```toml
[build]
  command = "pnpm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### Q3: 域名在国内被污染

**Netlify 域名状态：**
- ✅ `hotnewsaggregation.netlify.app` 通常可以正常访问
- ❌ 某些地区可能被污染

**解决方案：**
1. 在 Netlify 中添加自定义域名
2. 配置 DNS 解析
3. 等待 DNS 传播（1-2 小时）

---

## 自定义域名配置

### 步骤 1：购买域名

推荐域名服务商：
- 阿里云：https://wanwang.aliyun.com/
- 腾讯云：https://dnspod.cloud.tencent.com/
- Cloudflare：https://dash.cloudflare.com/

### 步骤 2：在 Netlify 添加域名

1. Netlify Dashboard → **Site settings** → **Domain management**
2. 点击 **"Add custom domain"**
3. 输入你的域名（如 `hotnewsaggregation.com`）

### 步骤 3：配置 DNS

Netlify 会提供 DNS 记录，添加到你的域名服务商：

| 类型 | 名称 | 值 |
|------|------|-----|
| CNAME | www | `hotnewsaggregation.netlify.app` |

### 步骤 4：等待 DNS 传播

通常需要 1-2 小时，最长 24 小时。

---

## 成本对比

| 平台 | 免费额度 | 域名 | 推荐度 |
|------|----------|------|--------|
| **Netlify** | 100GB/月 | `.netlify.app` 免费域名 | ⭐⭐⭐⭐⭐ |
| Vercel | 100GB/月 | `.vercel.app` (DNS 污染) | ⭐⭐ |
| Cloudflare Pages | 无限 | `.pages.dev` | ⭐⭐⭐ |
| 自定义域名 | 50-100元/年 | 完全自定义 | ⭐⭐⭐⭐ |

---

## 下一步

1. **立即部署到 Netlify**（推荐）
2. 测试所有功能是否正常
3. 如果在国内访问仍有问题，考虑购买自定义域名
4. 配置自定义域名（可选）

---

## 相关链接

- Netlify 文档：https://docs.netlify.com/
- Next.js 部署指南：https://nextjs.org/docs/deployment
- 项目仓库：https://github.com/zhaoshilong1987/hotnewsaggregation

---

**最后更新：** 2026-01-17
**技术栈：** Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Netlify
