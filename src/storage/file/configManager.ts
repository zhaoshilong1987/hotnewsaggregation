import fs from 'fs';
import path from 'path';
import {
  AppConfigFile,
  DEFAULT_APP_CONFIG,
  DEFAULT_PLATFORM_TAGS,
  PlatformConfig,
  AppSettings,
  PlatformTagsConfig,
} from './types';

// 配置文件路径
const CONFIG_DIR = process.env.CONFIG_DIR || path.join(process.cwd(), 'config');
const CONFIG_FILE_PATH = path.join(CONFIG_DIR, 'app-config.json');

/**
 * 确保配置目录存在
 */
export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * 读取配置文件
 */
export function readConfig(): AppConfigFile | null {
  try {
    ensureConfigDir();

    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      console.log('配置文件不存在，返回 null');
      return null;
    }

    const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
    const config = JSON.parse(fileContent) as AppConfigFile;
    console.log('成功读取配置文件');
    return config;
  } catch (error) {
    console.error('读取配置文件失败:', error);
    return null;
  }
}

/**
 * 写入配置文件
 */
export function writeConfig(config: AppConfigFile): boolean {
  try {
    ensureConfigDir();

    const fileContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(CONFIG_FILE_PATH, fileContent, 'utf-8');
    console.log('成功写入配置文件');
    return true;
  } catch (error) {
    console.error('写入配置文件失败:', error);
    return false;
  }
}

/**
 * 获取配置（如果不存在则创建默认配置）
 */
export function getConfig(): AppConfigFile {
  const config = readConfig();

  if (!config) {
    console.log('配置文件不存在，创建默认配置');
    const defaultConfig = DEFAULT_APP_CONFIG;
    writeConfig(defaultConfig);
    return defaultConfig;
  }

  return config;
}

/**
 * 获取所有平台配置
 */
export function getAllPlatforms(): PlatformConfig[] {
  const config = getConfig();
  return config.settings.platforms.sort((a, b) => a.priority - b.priority);
}

/**
 * 根据 key 获取平台配置
 */
export function getPlatformByKey(key: string): PlatformConfig | null {
  const platforms = getAllPlatforms();
  return platforms.find(p => p.key === key) || null;
}

/**
 * 根据 id 获取平台配置
 */
export function getPlatformById(id: number): PlatformConfig | null {
  const platforms = getAllPlatforms();
  return platforms.find(p => p.id === id) || null;
}

/**
 * 获取所有启用的平台配置
 */
export function getEnabledPlatforms(): PlatformConfig[] {
  const platforms = getAllPlatforms();
  return platforms.filter(p => p.enabled).sort((a, b) => a.priority - b.priority);
}

/**
 * 创建平台配置
 */
export function createPlatform(data: Omit<PlatformConfig, 'id'>): PlatformConfig {
  const config = getConfig();
  const platforms = config.settings.platforms;

  // 生成新的 ID（取最大ID + 1）
  const maxId = Math.max(0, ...platforms.map(p => p.id));
  const newId = maxId + 1;

  const newPlatform: PlatformConfig = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  platforms.push(newPlatform);

  // 更新配置文件
  config.settings.platforms = platforms;
  config.updatedAt = new Date().toISOString();
  writeConfig(config);

  return newPlatform;
}

/**
 * 更新平台配置
 */
export function updatePlatform(id: number, data: Partial<PlatformConfig>): PlatformConfig | null {
  const config = getConfig();
  const platforms = config.settings.platforms;
  const index = platforms.findIndex(p => p.id === id);

  if (index === -1) {
    console.error(`未找到 ID 为 ${id} 的平台配置`);
    return null;
  }

  // 更新平台配置
  platforms[index] = {
    ...platforms[index],
    ...data,
    id: platforms[index].id, // 确保 ID 不被修改
    updatedAt: new Date().toISOString(),
  };

  // 更新配置文件
  config.settings.platforms = platforms;
  config.updatedAt = new Date().toISOString();
  writeConfig(config);

  return platforms[index];
}

/**
 * 删除平台配置
 */
export function deletePlatform(id: number): boolean {
  const config = getConfig();
  const platforms = config.settings.platforms;
  const index = platforms.findIndex(p => p.id === id);

  if (index === -1) {
    console.error(`未找到 ID 为 ${id} 的平台配置`);
    return false;
  }

  platforms.splice(index, 1);

  // 更新配置文件
  config.settings.platforms = platforms;
  config.updatedAt = new Date().toISOString();
  writeConfig(config);

  return true;
}

/**
 * 切换平台启用状态
 */
export function togglePlatformEnabled(id: number): PlatformConfig | null {
  const platform = getPlatformById(id);

  if (!platform) {
    return null;
  }

  return updatePlatform(id, { enabled: !platform.enabled });
}

/**
 * 初始化默认配置（如果配置文件不存在）
 */
export function initDefaultConfig(): void {
  const config = readConfig();

  if (!config) {
    console.log('初始化默认配置');
    writeConfig(DEFAULT_APP_CONFIG);
  }
}

/**
 * 获取平台标签配置
 */
export function getPlatformTags(): PlatformTagsConfig {
  const config = getConfig();
  return config.settings.platformTags;
}

/**
 * 更新平台标签配置
 */
export function updatePlatformTags(visible: string[], hidden: string[]): boolean {
  const config = getConfig();

  config.settings.platformTags = {
    visible,
    hidden,
  };

  config.updatedAt = new Date().toISOString();

  return writeConfig(config);
}

/**
 * 重置平台标签配置为默认
 */
export function resetPlatformTags(): PlatformTagsConfig {
  const config = getConfig();

  // 使用预定义的默认平台标签配置
  config.settings.platformTags = {
    visible: DEFAULT_PLATFORM_TAGS.visible,
    hidden: DEFAULT_PLATFORM_TAGS.hidden,
  };
  config.updatedAt = new Date().toISOString();

  writeConfig(config);

  return config.settings.platformTags;
}
