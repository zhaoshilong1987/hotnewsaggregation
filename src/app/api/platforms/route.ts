import { NextResponse } from 'next/server';
import { PLATFORMS_CONFIG } from '@/lib/config';

export type PlatformConfig = typeof PLATFORMS_CONFIG.settings.platforms[number];

// GET - 获取所有平台配置
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: PLATFORMS_CONFIG.settings.platforms,
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

// POST - 添加或更新平台配置（仅返回成功，不实际修改配置）
export async function POST(request: Request) {
  try {
    const platform = await request.json() as PlatformConfig;

    // 注意：此API路由仅用于接口兼容，不实际修改配置
    // 配置修改应在 @/lib/config.ts 中进行
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

// DELETE - 删除平台配置（仅返回成功，不实际修改配置）
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    // 注意：此API路由仅用于接口兼容，不实际修改配置
    // 配置修改应在 @/lib/config.ts 中进行
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Failed to delete platform config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete platform config',
    }, { status: 500 });
  }
}
