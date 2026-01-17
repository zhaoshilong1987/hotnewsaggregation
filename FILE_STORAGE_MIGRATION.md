# 数据库到文件存储迁移说明

## 概述

本文档记录了将数据存储从 PostgreSQL 数据库迁移到 JSON 文件存储的过程和更改。

## 迁移原因

1. 简化部署流程，无需配置数据库服务
2. 降低应用复杂度，减少依赖
3. 便于用户手动修改配置
4. APK 安装后可直接使用，无需额外的数据库初始化

## 主要更改

### 1. 新增文件

#### 配置类型定义
- **文件**: `src/storage/file/types.ts`
- **内容**: 定义配置文件的数据结构和默认值
- **包含**: PlatformConfig, AppSettings, AppConfigFile 等类型

#### 配置管理器
- **文件**: `src/storage/file/configManager.ts`
- **内容**: 提供配置文件的读写操作
- **功能**:
  - readConfig(): 读取配置文件
  - writeConfig(): 写入配置文件
  - getConfig(): 获取或创建配置
  - getAllPlatforms(): 获取所有平台配置
  - getPlatformByKey(): 根据 key 获取平台
  - getPlatformById(): 根据 id 获取平台
  - getEnabledPlatforms(): 获取启用的平台
  - createPlatform(): 创建新平台
  - updatePlatform(): 更新平台配置
  - deletePlatform(): 删除平台
  - togglePlatformEnabled(): 切换启用状态
  - initDefaultConfig(): 初始化默认配置

#### API 路由
- **文件**: `src/app/api/config/init/route.ts`
- **功能**: 初始化配置文件接口

#### 文档
- **文件**: `config/README.md`
- **内容**: 配置文件使用说明和 API 文档

### 2. 修改文件

#### API 路由更新
- **文件**: `src/app/api/platforms/route.ts`
- **更改**: 从数据库操作改为文件操作
- **影响**: GET, POST, DELETE 接口现在使用配置文件

- **文件**: `src/app/api/platforms/init/route.ts`
- **更改**: 调用 initDefaultConfig() 而非数据库初始化

- **文件**: `src/app/api/news/[platform]/route.ts`
- **更改**: 使用 getEnabledPlatforms() 和 getPlatformByKey() 替代数据库操作

#### 组件更新
- **文件**: `src/components/PlatformSettings.tsx`
- **更改**: 导入类型从 `@/storage/database/shared/schema` 改为 `@/storage/file/types`

### 3. 删除文件

#### 数据库相关文件
- `src/lib/db.ts` - 数据库连接文件
- `src/lib/init-platforms.ts` - 数据库初始化文件
- `src/app/api/db-test/route.ts` - 数据库测试文件

#### 数据库管理器（可选保留）
- `src/storage/database/` 目录下的文件可以选择保留或删除

## 配置文件结构

### 位置
- 开发环境: `<项目根目录>/config/app-config.json`
- 生产环境: `<项目根目录>/config/app-config.json`

### 格式
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
        "apiUrl": "...",
        "method": "GET",
        "enabled": true,
        "priority": 1
      }
    ]
  }
}
```

## API 接口变更

### 保持不变的接口
- `GET /api/platforms` - 获取所有平台配置
- `POST /api/platforms` - 创建或更新平台配置
- `DELETE /api/platforms?id={id}` - 删除平台配置

### 新增接口
- `GET /api/config/init` - 初始化配置文件

## 兼容性说明

### 前端组件
- ✅ 无需修改，API 接口保持不变
- ✅ PlatformSettings 组件自动兼容
- ✅ PlatformEditor 组件不受影响

### 数据迁移
如果需要从数据库迁移到文件存储，可以使用以下步骤：

1. 从数据库导出平台配置
2. 转换为配置文件格式
3. 保存到 `config/app-config.json`

### APK 部署
- ✅ APK 安装后自动初始化配置文件
- ✅ 无需额外的数据库服务
- ✅ 配置文件持久化存储

## 测试结果

### 功能测试
- ✅ 配置文件初始化
- ✅ 读取平台配置
- ✅ 创建新平台
- ✅ 更新平台配置
- ✅ 删除平台
- ✅ 获取启用的平台
- ✅ 构建检查通过

### API 测试
```bash
# 初始化配置
curl -X GET http://localhost:5000/api/config/init

# 获取所有平台
curl -X GET http://localhost:5000/api/platforms

# 创建平台
curl -X POST http://localhost:5000/api/platforms \
  -H "Content-Type: application/json" \
  -d '{"key":"test","name":"测试","apiUrl":"https://test.com","method":"GET","enabled":true,"priority":100}'

# 更新平台
curl -X POST http://localhost:5000/api/platforms \
  -H "Content-Type: application/json" \
  -d '{"id":1,"key":"zhihu","name":"知乎","apiUrl":"...","method":"GET","enabled":true,"priority":1}'

# 删除平台
curl -X DELETE "http://localhost:5000/api/platforms?id=1"
```

## 注意事项

### 权限要求
- 应用需要对 `config/` 目录有读写权限
- 在生产环境中需要确保目录权限正确

### 备份建议
- 定期备份配置文件
- 修改配置前先备份

### 性能考虑
- 文件存储适合小规模配置
- 如果配置量很大，建议使用数据库
- 当前实现适用于 100 个以内的平台配置

### 并发访问
- 当前实现是同步文件操作
- 高并发场景下可能会有性能问题
- 如需高并发，建议使用数据库或添加锁机制

## 后续优化建议

1. **添加配置验证**
   - 在写入配置前验证数据格式
   - 添加配置文件版本检查

2. **支持加密**
   - 敏感配置可以加密存储
   - 使用环境变量存储密钥

3. **自动备份**
   - 定期自动备份配置文件
   - 保留历史版本

4. **热重载**
   - 配置文件更改后自动重载
   - 无需重启应用

5. **配置迁移**
   - 提供数据库到文件的迁移工具
   - 支持从旧版本配置升级

## 回滚方案

如果需要回滚到数据库存储：

1. 恢复数据库连接文件 `src/lib/db.ts`
2. 恢复数据库管理器 `src/storage/database/platformConfigManager.ts`
3. 更新 API 路由，将文件操作改为数据库操作
4. 从配置文件导入数据到数据库

## 总结

本次迁移成功将数据存储从 PostgreSQL 数据库改为 JSON 文件存储，简化了应用架构，降低了部署复杂度。所有功能测试通过，API 接口保持兼容，无需修改前端代码。

配置文件存储适合当前的应用规模，便于用户管理和修改配置。如果未来需要处理大量数据或需要高并发访问，可以考虑迁移回数据库或使用其他存储方案。
