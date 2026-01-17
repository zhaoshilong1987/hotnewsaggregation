# API 使用指南

## 默认行为

为了确保网页在 Vercel 上快速加载，**默认使用 mock 数据**。

## 切换到真实 API

您可以通过两种方式切换到真实 API：

### 方式 1：在页面设置中切换

1. 打开应用首页
2. 点击右上角的 **设置** 图标 ⚙️
3. 找到 "使用真实 API" 开关
4. 打开开关即可切换到真实 API

### 方式 2：在浏览器控制台中切换

打开浏览器开发者工具（F12），在 Console 中执行：

```javascript
// 切换到真实 API
localStorage.setItem('useRealApi', 'true');
location.reload();

// 切换回 mock 数据
localStorage.setItem('useRealApi', 'false');
location.reload();
```

## 超时保护机制

为了防止慢接口拖累整个应用，我们实现了多级超时保护：

### 1. 前端超时控制（10秒）

所有 API 请求都有 10 秒前端超时保护：

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

const response = await fetch('/api/news/all', {
  signal: controller.signal,
});
```

如果 API 在 10 秒内没有响应，会自动降级到 mock 数据。

### 2. API 路由超时控制

在 API 路由内部，我们为每个平台的外部 API 调用设置了 8 秒超时：

```typescript
const response = await fetchWithTimeout(apiUrl, {
  method: 'GET',
  next: { revalidate: 300 },
}, 8000); // 8秒超时
```

### 3. 批次超时控制

对于 `/api/news/all` 路由，我们实现了批次级别的超时控制（10秒）：

```typescript
const timeoutPromise = new Promise<never>((_, reject) =>
  setTimeout(() => reject(new Error('Batch timeout')), 10000)
);

const batchPromise = Promise.allSettled(
  batch.map(p => fetchFromExternalApi(p))
);

const batchResults = await Promise.race([batchPromise, timeoutPromise]);
```

## 降级策略

### 自动降级

当 API 请求超时或失败时，系统会自动降级到 mock 数据，确保用户始终能看到内容。

### 降级提示

降级时会在页面显示提示信息：

```
API 响应超时，已切换到模拟数据
```

## 性能对比

| 模式 | 首次加载时间 | 缓存命中时间 | 数据准确性 |
|------|-------------|-------------|-----------|
| Mock 数据 | < 1 秒 | < 1 秒 | 模拟数据 |
| 真实 API | 5-15 秒 | < 500ms | 实时数据 |

## 推荐使用场景

### 使用 Mock 数据（推荐）
- Vercel 部署环境
- 快速预览和测试
- 网络环境不稳定
- 对实时性要求不高

### 使用真实 API
- 本地开发环境
- 需要查看实时数据
- 网络环境良好
- 用于 Capacitor 打包的移动应用

## 故障排查

### 问题：API 请求一直超时

**可能原因**：
- 外部 API 服务不稳定
- 网络连接问题
- Vercel 环境限制

**解决方案**：
1. 切换到 mock 数据
2. 检查网络连接
3. 查看 Vercel Function Logs

### 问题：部分平台数据加载失败

**可能原因**：
- 特定平台 API 不可用
- API 数据格式变化

**解决方案**：
- 其他平台的数据仍然会正常加载
- 系统会自动跳过失败的平台

### 问题：页面加载仍然很慢

**检查清单**：
1. 是否开启了真实 API？
2. 浏览器缓存是否清除？
3. 网络连接是否稳定？
4. Vercel 部署状态是否正常？

## 监控 API 性能

### 在浏览器开发者工具中查看

1. 打开开发者工具（F12）
2. 切换到 **Network** 标签
3. 刷新页面
4. 查看 `/api/news/*` 请求的响应时间

### 在 Vercel 控制台中查看

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)
2. 进入项目 → Deployments
3. 点击最新部署记录
4. 查看 **Function Logs** 标签

## 外部 API 配置

平台 API 配置存储在 `config/app-config.json` 文件中：

```json
{
  "settings": {
    "platforms": [
      {
        "id": 1,
        "key": "zhihu",
        "name": "知乎",
        "apiUrl": "https://news.qualyouhulian.com/api/s?id=1&latest",
        "method": "GET",
        "enabled": true,
        "priority": 0
      }
    ]
  }
}
```

**注意**：配置文件修改后会自动生效（60秒缓存）。

---

**最后更新**: 2024
