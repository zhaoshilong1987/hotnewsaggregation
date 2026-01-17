# Vercel 部署排查清单

## ✅ 已完成的修复

- [x] 修复启动脚本 `scripts/start.sh`，支持 Vercel 的 `PORT` 环境变量
- [x] 确认 `next.config.ts` 无静态导出配置
- [x] 确认首页 `src/app/page.tsx` 存在

## 📋 部署前检查

### 1. 提交代码修改
```bash
git add scripts/start.sh
git commit -m "fix: 修复 Vercel 部署启动脚本，支持环境变量 PORT"
git push
```

### 2. 检查 Vercel 项目设置

登录 [Vercel 控制台](https://vercel.com/dashboard) → 项目 → Settings

#### General 设置
- [ ] **Output Directory**: 留空（不要填写 `out`）
- [ ] **Framework Preset**: Next.js

#### Environment Variables（如需要）
- [ ] 如果有环境变量，确保已添加到项目设置中

### 3. 验证 GitHub 集成
- [ ] Vercel 已连接到您的 GitHub 仓库
- [ ] 自动部署已启用

## 🚀 部署过程监控

### 1. 查看部署状态
1. 登录 Vercel 控制台
2. 进入项目 → Deployments 标签
3. 查看最新部署的状态：
   - 🟢 Building：构建中，正常
   - ✅ Ready：部署成功
   - ❌ Error：部署失败，需要排查

### 2. 查看构建日志
点击部署记录 → Build Logs 标签

**关键检查点**：
- [ ] `pnpm install` 成功
- [ ] `npx next build` 成功
- [ ] 没有编译错误
- [ ] 没有 TypeScript 错误

### 3. 查看运行日志
部署成功后 → Function Logs 标签

**关键检查点**：
- [ ] `npx next start` 成功启动
- [ ] 没有 "Cannot find module" 错误
- [ ] 没有端口占用错误

## 🔍 常见错误及解决方案

### 错误 1: Output Directory "out" not found
**原因**: Vercel 项目设置中 Output Directory 配置为 `out`
**解决**: Settings → General → Output Directory → 留空 → Save

### 错误 2: EADDRINUSE (Address already in use)
**原因**: 启动脚本指定了固定端口
**解决**: ✅ 已修复，使用环境变量 `PORT`

### 错误 3: Cannot find module 'xxx'
**原因**: 依赖未安装
**解决**: 检查 `pnpm install` 是否成功，查看 Build Logs

### 错误 4: 404 Not Found
**原因**: 路由问题或页面缺失
**解决**: 确认 `src/app/page.tsx` 存在且正确导出

### 错误 5: 500 Internal Server Error
**原因**: 运行时错误
**解决**: 查看 Function Logs 中的堆栈信息

## 🌐 部署后验证

### 1. 访问测试域名
- 格式: `https://your-project.vercel.app`
- 检查: 页面能否正常加载

### 2. 功能测试
- [ ] 首页能正常显示
- [ ] 点击平台切换能正常跳转
- [ ] 下拉刷新能正常工作
- [ ] API 接口能正常返回数据

### 3. 性能检查
- [ ] 页面加载速度
- [ ] 控制台无错误信息
- [ ] 网络请求无 404/500 错误

## 📞 获取帮助

如果部署仍然失败，请收集以下信息：

1. **部署状态截图**
2. **Build Logs 完整错误信息**
3. **Function Logs 错误堆栈**
4. **浏览器控制台错误信息**

## 📝 下一步

部署成功后，可以进行以下操作：

1. ✅ 配置自定义域名（如需）
2. ✅ 设置环境变量（如需）
3. ✅ 配置 Capacitor WebView
4. ✅ 打包移动应用

---

**最后更新**: 修复启动脚本支持 Vercel 环境变量
