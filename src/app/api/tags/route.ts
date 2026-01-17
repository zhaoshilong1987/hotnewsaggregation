import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config', 'app-config.json');

interface TagsConfig {
  visible: string[];
  hidden: string[];
}

// 缓存配置文件，避免重复读取
let configCache: any = null;
let configCacheTime = 0;
const CONFIG_CACHE_TTL = 60000; // 60秒缓存

// 读取配置文件
async function readConfigFile(): Promise<any> {
  const now = Date.now();
  // 使用缓存减少文件读取
  if (configCache && (now - configCacheTime) < CONFIG_CACHE_TTL) {
    return configCache;
  }

  try {
    const content = await fs.readFile(CONFIG_FILE_PATH, 'utf-8');
    configCache = JSON.parse(content);
    configCacheTime = now;
    return configCache;
  } catch (error) {
    console.error('Failed to read config file:', error);
    throw error;
  }
}

// 写入配置文件
async function writeConfigFile(config: any): Promise<void> {
  try {
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write config file:', error);
    throw error;
  }
}

// GET - 获取平台标签配置
export async function GET() {
  try {
    const config = await readConfigFile();
    const tagsConfig: TagsConfig = config.settings?.platformTags || { visible: [], hidden: [] };

    return NextResponse.json({
      success: true,
      data: tagsConfig,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Failed to read tags config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to read tags config',
    }, { status: 500 });
  }
}

// POST - 更新平台标签配置
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visible, hidden } = body as TagsConfig;

    if (!Array.isArray(visible) || !Array.isArray(hidden)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data format',
      }, { status: 400 });
    }

    const config = await readConfigFile();
    config.settings.platformTags = { visible, hidden };
    await writeConfigFile(config);

    return NextResponse.json({
      success: true,
      data: config.settings.platformTags,
    });
  } catch (error) {
    console.error('Failed to save tags config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save tags config',
    }, { status: 500 });
  }
}
