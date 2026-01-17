# 推送代码到 GitHub 指南

## 📦 当前状态

**待推送的提交**：2 个

```
0c8be23 refactor: 更新应用标题为'全网热点'
03b8c7a fix: 前端添加超时控制，默认使用 mock 数据避免加载超时
```

## 🚀 推送步骤

### 步骤 1：生成 GitHub Personal Access Token

如果还没有 Personal Access Token，请按以下步骤创建：

1. 登录 GitHub
2. 点击右上角头像 → **Settings**
3. 左侧菜单 → **Developer settings**
4. 选择 **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token (classic)**
6. 填写信息：
   - **Note**：输入描述，如 "Vercel Deployment"
   - **Expiration**：选择过期时间（建议选择 90 days）
   - **Select scopes**：勾选 **repo**（所有子项）
7. 点击 **Generate token**
8. **重要**：复制生成的 token（只显示一次，务必保存）

### 步骤 2：在沙盒中推送代码

在沙盒终端中执行以下命令：

```bash
# 方法 1：使用 Personal Access Token（推荐）
git push https://YOUR_TOKEN@github.com/your-username/your-repo.git main

# 示例（替换为实际信息）：
git push https://ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/yourname/hotlistnews.git main
```

**说明**：
- `YOUR_TOKEN`：替换为您生成的 Personal Access Token
- `your-username/your-repo`：替换为实际的 GitHub 仓库地址
- `main`：分支名称

### 步骤 3：验证推送成功

推送成功后会显示类似以下信息：

```
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
Delta compression using up to 8 threads
Compressing objects: 100% (15/15), done.
Writing objects: 100% (15/15), 5.2 KiB | 5.2 MiB/s, done.
Total 15 (delta 10), reused 0 (delta 0), pack-reused 0
To https://github.com/yourname/hotlistnews.git
   a1b2c3d..0c8be23  main -> main
```

## 🔄 Vercel 自动部署

推送成功后：

1. Vercel 会自动检测到新的提交
2. 自动触发部署流程（约 2-3 分钟）
3. 部署完成后，新版本会自动上线

### 查看部署状态

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)
2. 进入您的项目
3. 点击 **Deployments** 标签
4. 查看最新部署的状态：
   - 🟢 **Building**：正在构建
   - ✅ **Ready**：部署成功
   - ❌ **Error**：部署失败

## ❓ 常见问题

### Q1：推送时提示 "Authentication failed"

**原因**：Token 无效或过期

**解决方案**：
1. 检查 Token 是否正确复制
2. 生成新的 Token
3. 重新推送

### Q2：推送时提示 "Permission denied"

**原因**：Token 权限不足

**解决方案**：
1. 确保 Token 勾选了 `repo` 权限
2. 重新生成包含完整权限的 Token

### Q3：不知道仓库地址

**查看方法**：

```bash
# 在沙盒中执行
git remote -v
```

输出示例：
```
origin	https://github.com/yourname/hotlistnews.git (fetch)
origin	https://github.com/yourname/hotlistnews.git (push)
```

使用输出中的 `https://github.com/yourname/hotlistnews.git`

### Q4：如何避免每次都输入 Token？

**方法 1：保存到远程仓库地址**

```bash
# 更新远程仓库地址，包含 Token
git remote set-url origin https://YOUR_TOKEN@github.com/your-username/your-repo.git

# 之后只需要执行
git push
```

**注意**：Token 会保存在 `.git/config` 文件中，请确保这是私人的机器。

**方法 2：使用 SSH 密钥**（更安全）

```bash
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 查看公钥
cat ~/.ssh/id_ed25519.pub

# 3. 将公钥添加到 GitHub：
#    Settings → SSH and GPG keys → New SSH key

# 4. 更新远程仓库地址为 SSH
git remote set-url origin git@github.com:your-username/your-repo.git

# 5. 推送
git push
```

## 📝 本地查看修改

```bash
# 查看提交历史
git log --oneline -5

# 查看最近的修改内容
git show HEAD

# 查看文件状态
git status
```

## 🎯 下一步

推送成功后：

1. 等待 Vercel 自动部署（2-3 分钟）
2. 访问 `https://hotlistnews.vercel.app` 测试
3. 检查页面加载速度（应该 < 1 秒）
4. 如需查看实时数据，在设置中切换到真实 API

---

**最后更新**: 2024
