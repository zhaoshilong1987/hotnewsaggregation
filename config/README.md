# 配置文件说明

## 概述

本项目使用 JSON 格式的配置文件来存储应用设置，包括平台配置、API 地址等数据，不再依赖数据库。

## 配置文件位置

- **开发环境**: `<项目根目录>/config/app-config.json`
- **生产环境**: `<项目根目录>/config/app-config.json`

## 配置文件结构

```json
{
  "version": "1.0.0",
  "updatedAt": "2026-01-16T03:58:12.153Z",
  "settings": {
    "platforms": [
      {
        "id": 1,
        "key": "zhihu",
        "name": "知乎",
        "apiUrl": "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true",
        "method": "GET",
        "enabled": true,
        "priority": 1,
        "createdAt": "2026-01-16T03:58:05.874Z",
        "updatedAt": "2026-01-16T03:58:12.153Z"
      }
    ],
    "platformTags": {
      "visible": ["zhihu", "weibo", "toutiao"],
      "hidden": ["wallstreet", "coolapk", "douyin"]
    }
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `version` | string | 配置文件版本 |
| `updatedAt` | string | 最后更新时间（ISO 8601格式） |
| `settings.platforms` | array | 平台配置数组 |
| `settings.platformTags` | object | 平台标签配置 |

#### 平台配置字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | number | 平台唯一标识 |
| `key` | string | 平台代码（如 zhihu, weibo） |
| `name` | string | 平台显示名称 |
| `apiUrl` | string | API接口地址 |
| `method` | string | HTTP请求方法（GET/POST） |
| `enabled` | boolean | 是否启用 |
| `priority` | number | 显示优先级（越小越靠前） |
| `createdAt` | string | 创建时间（可选） |
| `updatedAt` | string | 更新时间（可选） |

#### 平台标签配置字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `visible` | array | 显示的平台标签key列表 |
| `hidden` | array | 隐藏的平台标签key列表 |

## API 接口

### 1. 获取所有平台配置

```bash
GET /api/platforms
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "zhihu",
      "name": "知乎",
      "apiUrl": "...",
      "method": "GET",
      "enabled": true,
      "priority": 1
    }
  ]
}
```

### 2. 创建或更新平台配置

```bash
POST /api/platforms
Content-Type: application/json

{
  "id": 1,              // 更新时必填，创建时不填
  "key": "zhihu",
  "name": "知乎",
  "apiUrl": "...",
  "method": "GET",
  "enabled": true,
  "priority": 1
}
```

### 3. 删除平台配置

```bash
DELETE /api/platforms?id=1
```

### 4. 初始化配置文件

```bash
GET /api/config/init
```

该接口会在配置文件不存在时自动创建默认配置。

### 5. 获取平台标签配置

```bash
GET /api/tags
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "visible": ["zhihu", "weibo", "toutiao"],
    "hidden": ["wallstreet", "coolapk", "douyin"]
  }
}
```

### 6. 更新平台标签配置

```bash
POST /api/tags
Content-Type: application/json

{
  "visible": ["zhihu", "weibo", "toutiao"],
  "hidden": ["wallstreet", "coolapk", "douyin"]
}
```

### 7. 重置平台标签配置

```bash
PUT /api/tags
```

该接口会将平台标签配置重置为默认值（显示前8个平台）。

## APK 安装说明

### 自动初始化

APK 安装后，首次启动应用时会自动：

1. 检查配置文件是否存在
2. 如果不存在，创建默认配置文件 `config/app-config.json`
3. 加载默认的15个平台配置

### 配置文件持久化

- 配置文件存储在应用的数据目录中
- 卸载应用时配置文件会被删除
- 更新应用时配置文件会保留（除非明确清理数据）

## 手动修改配置

### 方法1：直接编辑配置文件

1. 找到 `config/app-config.json` 文件
2. 使用文本编辑器修改
3. 保存文件，重启应用

### 方法2：通过应用界面修改

#### 修改平台标签配置
1. 打开应用
2. 点击顶部平台标签栏右侧的设置按钮
3. 在弹出的编辑器中调整平台标签
4. 点击保存，配置会自动保存到配置文件

#### 修改平台API配置
1. 打开应用
2. 进入"我的"页面
3. 点击"平台API配置"
4. 在界面中添加/编辑/删除平台配置

## 备份与恢复

### 备份

```bash
cp config/app-config.json config/app-config.json.backup
```

### 恢复

```bash
cp config/app-config.json.backup config/app-config.json
```

## 故障排查

### 配置文件不存在

**症状**: 应用无法加载平台配置

**解决方案**:
1. 访问 `http://localhost:5000/api/config/init` 初始化配置
2. 或手动创建 `config/app-config.json` 文件

### 配置文件格式错误

**症状**: API返回错误，无法读取配置

**解决方案**:
1. 检查JSON格式是否正确
2. 使用在线JSON验证工具验证
3. 恢复备份或重新初始化

### 权限问题

**症状**: 无法写入配置文件

**解决方案**:
1. 检查 `config` 目录的读写权限
2. 确保应用有权限访问该目录

## 开发说明

### 添加新的配置项

如果需要添加新的配置项（如主题、语言等），请按以下步骤：

1. 在 `src/storage/file/types.ts` 中更新 `AppSettings` 接口
2. 在 `src/storage/file/configManager.ts` 中添加相应的读写函数
3. 创建对应的 API 路由
4. 更新前端组件以支持新配置

### 默认配置

默认配置定义在 `src/storage/file/types.ts` 文件中的 `DEFAULT_APP_CONFIG` 常量。如需修改默认配置，请编辑该文件。
