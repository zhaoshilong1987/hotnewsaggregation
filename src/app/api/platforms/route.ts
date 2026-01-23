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

// POST - 添加或更新平台配置
export async function POST(request: Request) {
  try {
    const platform = await request.json() as PlatformConfig;

    // 注意：当前为演示模式，不实际持久化配置
    // 实际项目中应该将配置保存到数据库或配置文件
    console.log('[演示模式] 保存平台配置:', platform);

    return NextResponse.json({
      success: true,
      data: platform,
      message: '配置保存成功（演示模式）',
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

    // 注意：当前为演示模式，不实际删除配置
    // 实际项目中应该从数据库或配置文件中删除
    console.log('[演示模式] 删除平台配置:', id);

    return NextResponse.json({
      success: true,
      message: '删除成功（演示模式）',
    });
  } catch (error) {
    console.error('Failed to delete platform config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete platform config',
    }, { status: 500 });
  }
}
