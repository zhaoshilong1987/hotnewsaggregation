# 热榜资讯 App - 移动端预览指南

## 📱 移动端预览功能

本项目已优化为移动端App布局，并提供了专业的移动端预览工具。

## 🚀 使用预览功能

### 方式一：直接访问预览页面
访问以下URL即可进入手机预览模式：
```
http://localhost:5000/preview
```

### 方式二：从主页切换
1. 访问主页 `http://localhost:5000`
2. 点击顶部导航栏的 📱 手机图标
3. 即可切换到手机预览模式

## 🎛️ 预览控制面板

预览页面提供以下设备尺寸选项：

| 设备类型 | 屏幕尺寸 | 说明 |
|---------|---------|------|
| 手机 | 375 × 667 | iPhone SE 尺寸 |
| 大屏手机 | 414 × 896 | iPhone 12/13/14 Pro 尺寸 |
| 超大屏手机 | 428 × 926 | iPhone 14 Pro Max 尺寸 |
| 平板 | 768 × 1024 | iPad 竖屏尺寸 |
| 桌面 | 1920 × 1080 | 桌面显示器尺寸 |

## ⌨️ 快捷键

- **F** - 切换全屏预览模式
- **H** - 隐藏/显示控制面板

## 📐 移动端布局特点

### 底部导航
- 热榜：查看各平台热榜
- 搜索：搜索全网热点
- 收藏：查看收藏内容
- 我的：个人中心

### 交互优化
- ✅ 下拉刷新
- ✅ 触摸友好的元素尺寸（最小44px）
- ✅ 流畅的过渡动画
- ✅ 横向滚动的平台Tab
- ✅ 单手操作友好的布局

### 视觉设计
- 🎨 橙色主题色
- 📱 卡片式布局
- 🌈 渐变色排名徽章
- 🔲 圆角设计
- 📊 层次分明的阴影效果

## 📱 真机测试

在真实移动设备上测试：

1. 确保设备和开发机在同一网络
2. 在开发机执行：
   ```bash
   coze dev
   ```
3. 查看输出的网络地址，例如：
   ```
   ▲ Next.js 16.1.1
   - Local:        http://localhost:5000
   - Network:      http://192.168.1.100:5000
   ```
4. 在手机浏览器访问 Network 地址

## 🎯 开发建议

### 响应式断点
- 移动端：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

### 最佳实践
1. 始终在移动端预览模式下开发
2. 测试不同设备尺寸的适配
3. 确保触摸目标至少44×44px
4. 验证下拉刷新和滚动性能
5. 检查底部导航在不同页面的一致性

## 🔧 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Lucide React (图标库)

## 📄 页面结构

```
src/app/
├── page.tsx              # 主页（热榜）
├── search/page.tsx       # 搜索页
├── favorites/page.tsx     # 收藏页
├── history/page.tsx       # 历史页
├── profile/page.tsx       # 个人中心
├── news/[id]/page.tsx    # 新闻详情
└── preview/page.tsx       # 移动端预览

src/components/
├── BottomNavigation.tsx  # 底部导航组件
├── NewsCard.tsx         # 新闻卡片组件
└── MobilePreview.tsx    # 手机预览组件
```

---

如有问题，请查看 [Next.js 文档](https://nextjs.org/docs) 或 [Tailwind CSS 文档](https://tailwindcss.com/docs)。
