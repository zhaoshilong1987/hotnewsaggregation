import { NextResponse } from 'next/server';
import { PLATFORMS_CONFIG } from '@/lib/config';

export const runtime = 'edge';

export interface TagsConfig {
  visible: string[];
  hidden: string[];
}

// GET - 获取平台标签配置
export async function GET() {
  try {
    // 从静态配置中读取平台标签
    const tagsConfig = PLATFORMS_CONFIG.settings.tags;

    // 如果 visible 为空，使用所有启用的平台
    let visiblePlatforms = [...tagsConfig.visible];
    if (visiblePlatforms.length === 0) {
      const enabledPlatforms = PLATFORMS_CONFIG.settings.platforms
        .filter(p => p.enabled)
        .map(p => p.key);

      visiblePlatforms = enabledPlatforms;
      console.log('platformTags is empty, using all enabled platforms:', enabledPlatforms);
    }

    const result: TagsConfig = {
      visible: visiblePlatforms,
      hidden: [...tagsConfig.hidden],
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

// POST - 更新平台标签配置
export async function POST(request: Request) {
  try {
    const body = await request.json() as { visible?: string[]; hidden?: string[] };

    // 更新内存中的配置
    if (body.visible) {
      PLATFORMS_CONFIG.settings.tags.visible = body.visible;
    }
    if (body.hidden) {
      PLATFORMS_CONFIG.settings.tags.hidden = body.hidden;
    }

    console.log('Updated platform tags config:', {
      visible: PLATFORMS_CONFIG.settings.tags.visible,
      hidden: PLATFORMS_CONFIG.settings.tags.hidden,
    });

    return NextResponse.json({
      success: true,
      data: {
        visible: PLATFORMS_CONFIG.settings.tags.visible,
        hidden: PLATFORMS_CONFIG.settings.tags.hidden,
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
