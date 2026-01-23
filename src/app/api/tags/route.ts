import { NextResponse } from 'next/server';
import { PLATFORMS_CONFIG } from '@/lib/config';

export interface TagsConfig {
  visible: string[];
  hidden: string[];
}

// GET - 获取平台标签配置
export async function GET() {
  try {
    // 如果 visible 为空，使用所有启用的平台
    let visiblePlatforms = [...PLATFORMS_CONFIG.settings.tags.visible];
    if (visiblePlatforms.length === 0) {
      const enabledPlatforms = PLATFORMS_CONFIG.settings.platforms
        .filter(p => p.enabled)
        .map(p => p.key);

      visiblePlatforms = enabledPlatforms;
      console.log('platformTags is empty, using all enabled platforms:', enabledPlatforms);
    }

    const result: TagsConfig = {
      visible: visiblePlatforms,
      hidden: [...PLATFORMS_CONFIG.settings.tags.hidden],
    };

    console.log('Returning platform tags config:', result);

    return NextResponse.json({
      success: true,
      data: result,
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

// POST - 更新平台标签配置（仅返回成功，不实际修改配置）
export async function POST(request: Request) {
  try {
    const body = await request.json() as { visible?: string[]; hidden?: string[] };

    // 注意：此API路由仅用于接口兼容，不实际修改配置
    // 配置修改应在 @/lib/config.ts 中进行
    console.log('Platform tags update requested (not persisted):', body);

    return NextResponse.json({
      success: true,
      data: {
        visible: body.visible || [],
        hidden: body.hidden || [],
      },
    });
  } catch (error) {
    console.error('Failed to update tags config:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update tags config',
    }, { status: 500 });
  }
}
