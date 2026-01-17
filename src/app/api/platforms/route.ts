import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config', 'app-config.json');

export interface PlatformConfig {
  id: number;
  key: string;
  name: string;
  apiUrl: string;
  method: 'GET' | 'POST';
  enabled: boolean;
  priority: number;
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

// GET - 获取所有平台配置
export async function GET() {
  try {
    const config = await readConfigFile();
    const platforms: PlatformConfig[] = config.settings?.platforms || [];

    return NextResponse.json({
      success: true,
      data: platforms,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Failed to read platforms config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to read platforms config',
    }, { status: 500 });
  }
}

// POST - 添加或更新平台配置
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, key, name, apiUrl, method, enabled, priority } = body as PlatformConfig;

    if (!key || !name || !apiUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      }, { status: 400 });
    }

    const config = await readConfigFile();
    let platforms: PlatformConfig[] = config.settings?.platforms || [];

    if (id && id > 0) {
      // 更新现有平台
      const index = platforms.findIndex(p => p.id === id);
      if (index !== -1) {
        platforms[index] = {
          id,
          key,
          name,
          apiUrl,
          method: method || 'GET',
          enabled: enabled !== undefined ? enabled : true,
          priority: priority !== undefined ? priority : platforms.length,
        };
      } else {
        return NextResponse.json({
          success: false,
          error: 'Platform not found',
        }, { status: 404 });
      }
    } else {
      // 添加新平台
      const newId = platforms.length > 0 ? Math.max(...platforms.map(p => p.id)) + 1 : 1;
      platforms.push({
        id: newId,
        key,
        name,
        apiUrl,
        method: method || 'GET',
        enabled: enabled !== undefined ? enabled : true,
        priority: priority !== undefined ? priority : platforms.length,
      });
    }

    config.settings.platforms = platforms;
    await writeConfigFile(config);

    return NextResponse.json({
      success: true,
      data: platforms,
    });
  } catch (error) {
    console.error('Failed to save platform config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save platform config',
    }, { status: 500 });
  }
}

// DELETE - 删除平台配置
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id || id <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid platform ID',
      }, { status: 400 });
    }

    const config = await readConfigFile();
    let platforms: PlatformConfig[] = config.settings?.platforms || [];

    const initialLength = platforms.length;
    platforms = platforms.filter(p => p.id !== id);

    if (platforms.length === initialLength) {
      return NextResponse.json({
        success: false,
        error: 'Platform not found',
      }, { status: 404 });
    }

    config.settings.platforms = platforms;
    await writeConfigFile(config);

    return NextResponse.json({
      success: true,
      data: platforms,
    });
  } catch (error) {
    console.error('Failed to delete platform config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete platform config',
    }, { status: 500 });
  }
}
