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

// POST - 添加或更新平台配置（已禁用，配置现在是静态的）
export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Platform configuration is read-only in Edge Runtime. Please modify the configuration in the code.',
  }, { status: 405 });
}

// DELETE - 删除平台配置（已禁用，配置现在是静态的）
export async function DELETE() {
  return NextResponse.json({
    success: false,
    error: 'Platform configuration is read-only in Edge Runtime. Please modify the configuration in the code.',
  }, { status: 405 });
}
