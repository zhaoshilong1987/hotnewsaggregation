# GitHub Actions 自动部署配置指南

本指南帮助你配置 GitHub Actions 实现自动部署到 Netlify。

## 配置步骤

### 1. 获取 Netlify API Token

1. 登录 [Netlify](https://app.netlify.com/)
2. 点击右上角头像 → **User settings** → **Applications**
3. 在 **Personal access tokens** 部分，点击 **New access token**
4. 输入描述（如 `GitHub Actions`），点击 **Generate token**
5. 复制生成的 token（格式：`nf_xxxxx...`）

### 2. 获取 Netlify Site ID

1. 打开你的 Netlify 项目：https://app.netlify.com/sites/hotnewsaggregation
2. 进入 **Site settings** → **Site information**
3. 复制 **API ID**（格式：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）

### 3. 配置 GitHub Secrets

1. 打开你的 GitHub 仓库：https://github.com/zhaoshilong1987/hotnewsaggregation/settings/secrets/actions
2. 点击 **New repository secret**
3. 添加以下两个 secrets：

| Secret Name | 值 |
|-------------|-----|
| `NETLIFY_AUTH_TOKEN` | 上一步获取的 Netlify API Token |
| `NETLIFY_SITE_ID` | 上一步获取的 Netlify Site ID |

### 4. 配置完成

配置完成后，每次向 `main` 分支推送代码时，GitHub Actions 会自动：

1. 检出代码
2. 设置 Node.js 20 环境
3. 安装依赖（使用 pnpm）
4. 运行类型检查
5. 构建应用
6. 部署到 Netlify

## 验证部署

推送代码后，查看 GitHub Actions 运行状态：

1. 进入 GitHub 仓库的 **Actions** 标签页
2. 点击最新的工作流运行查看详情
3. 部署成功后，Netlify 会生成预览链接

## 工作流配置

工作流文件位于：`.github/workflows/netlify.yml`

### 触发条件

- 推送到 `main` 分支时触发部署
- 创建 Pull Request 时触发预览部署

### 环境要求

- Node.js: 20
- 包管理器: pnpm 8
- 构建输出目录: `./out`

## 故障排查

### 构建失败

1. 检查 GitHub Actions 日志
2. 确认所有 secrets 已正确配置
3. 检查 Netlify 构建日志

### 部署失败

1. 确认 `NETLIFY_AUTH_TOKEN` 有效
2. 确认 `NETLIFY_SITE_ID` 正确
3. 检查 Netlify 账户权限

## 联系支持

如有问题，请查看：
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Netlify 部署文档](https://docs.netlify.com/site-deploys/overview/)
