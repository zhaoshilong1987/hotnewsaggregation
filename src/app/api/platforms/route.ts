import { NextResponse } from 'next/server';
import { PLATFORMS_CONFIG } from '@/lib/config';

export const runtime = 'edge';

export type PlatformConfig = typeof PLATFORMS_CONFIG.settings.platforms[number];

// GET - 获取所有平台配置
export async function GET() {
  try {
    const platforms = PLATFORMS_CONFIG.settings.platforms;

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
    const platform = await request.json() as PlatformConfig;

    // 更新内存中的配置
    const index = PLATFORMS_CONFIG.settings.platforms.findIndex(p => p.id === platform.id);

    if (index >= 0) {
      // 更新现有平台
      PLATFORMS_CONFIG.settings.platforms[index] = platform;
    } else {
      // 添加新平台
      PLATFORMS_CONFIG.settings.platforms.push(platform);
    }

    return NextResponse.json({
      success: true,
      data: platform,
    });
  } catch (error) {
    console.error('Failed to update platform config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update platform config',
    }, { status: 500 });
  }
}

// DELETE - 删除平台配置
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    // 从内存中删除配置
    const index = PLATFORMS_CONFIG.settings.platforms.findIndex(p => p.id === id);

    if (index >= 0) {
      PLATFORMS_CONFIG.settings.platforms.splice(index, 1);
      return NextResponse.json({
        success: true,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Platform not found',
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete platform config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete platform config',
    }, { status: 500 });
  }
}
