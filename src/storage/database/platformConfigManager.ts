import { eq, and, desc } from 'drizzle-orm';
import { getDb } from 'coze-coding-dev-sdk';
import {
  platformConfigs,
  type PlatformConfig,
  type NewPlatformConfig,
  type UpdatePlatformConfig,
  insertPlatformConfigSchema,
  updatePlatformConfigSchema,
} from './shared/schema';

export class PlatformConfigManager {
  /**
   * 获取所有平台配置
   */
  async getAllPlatforms(): Promise<PlatformConfig[]> {
    const db = await getDb();
    return db.select().from(platformConfigs).orderBy(platformConfigs.priority);
  }

  /**
   * 根据 key 获取平台配置
   */
  async getPlatformByKey(key: string): Promise<PlatformConfig | null> {
    const db = await getDb();
    const [platform] = await db.select().from(platformConfigs).where(eq(platformConfigs.key, key));
    return platform || null;
  }

  /**
   * 根据 id 获取平台配置
   */
  async getPlatformById(id: number): Promise<PlatformConfig | null> {
    const db = await getDb();
    const [platform] = await db.select().from(platformConfigs).where(eq(platformConfigs.id, id));
    return platform || null;
  }

  /**
   * 获取所有启用的平台配置
   */
  async getEnabledPlatforms(): Promise<PlatformConfig[]> {
    const db = await getDb();
    return db
      .select()
      .from(platformConfigs)
      .where(eq(platformConfigs.enabled, true))
      .orderBy(platformConfigs.priority);
  }

  /**
   * 创建平台配置
   */
  async createPlatform(data: NewPlatformConfig): Promise<PlatformConfig> {
    const db = await getDb();
    const validated = insertPlatformConfigSchema.parse(data);
    const [platform] = await db.insert(platformConfigs).values(validated).returning();
    return platform;
  }

  /**
   * 更新平台配置
   */
  async updatePlatform(id: number, data: UpdatePlatformConfig): Promise<PlatformConfig | null> {
    const db = await getDb();
    const validated = updatePlatformConfigSchema.parse(data);
    const [platform] = await db
      .update(platformConfigs)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(platformConfigs.id, id))
      .returning();
    return platform || null;
  }

  /**
   * 删除平台配置
   */
  async deletePlatform(id: number): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(platformConfigs).where(eq(platformConfigs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 切换平台启用状态
   */
  async togglePlatformEnabled(id: number): Promise<PlatformConfig | null> {
    const db = await getDb();
    const [platform] = await db.select().from(platformConfigs).where(eq(platformConfigs.id, id));

    if (!platform) {
      return null;
    }

    const [updated] = await db
      .update(platformConfigs)
      .set({ enabled: !platform.enabled, updatedAt: new Date() })
      .where(eq(platformConfigs.id, id))
      .returning();

    return updated || null;
  }

  /**
   * 初始化默认平台配置
   */
  async initDefaultPlatforms(): Promise<void> {
    const existingPlatforms = await this.getAllPlatforms();

    if (existingPlatforms.length > 0) {
      console.log('平台配置已存在，跳过初始化');
      return;
    }

    const defaultPlatforms: NewPlatformConfig[] = [
      {
        key: 'zhihu',
        name: '知乎',
        apiUrl: 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true',
        method: 'GET',
        enabled: true,
        priority: 1,
      },
      {
        key: 'weibo',
        name: '微博',
        apiUrl: 'https://s.weibo.com/top/summary?cate=realtimehot',
        method: 'GET',
        enabled: true,
        priority: 2,
      },
      {
        key: 'wallstreet',
        name: '华尔街见闻',
        apiUrl: 'https://wallstreetcn.com/apiv1/finance/hot/items',
        method: 'GET',
        enabled: true,
        priority: 3,
      },
      {
        key: 'coolapk',
        name: '酷安',
        apiUrl: 'https://api.coolapk.com/v6/main/indexV8?page=1&firstItemId=0&lastItemId=0',
        method: 'GET',
        enabled: true,
        priority: 4,
      },
      {
        key: 'douyin',
        name: '抖音',
        apiUrl: 'https://www.douyin.com/aweme/v1/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1',
        method: 'GET',
        enabled: true,
        priority: 5,
      },
      {
        key: 'hupu',
        name: '虎扑',
        apiUrl: 'https://bbs.hupu.com/api/topic/1/hot',
        method: 'GET',
        enabled: true,
        priority: 6,
      },
      {
        key: 'tieba',
        name: '百度贴吧',
        apiUrl: 'https://tieba.baidu.com/hottopic/browse/topicList',
        method: 'GET',
        enabled: true,
        priority: 7,
      },
      {
        key: 'toutiao',
        name: '今日头条',
        apiUrl: 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc&channel_id=1&pc_client_type=1',
        method: 'GET',
        enabled: true,
        priority: 8,
      },
      {
        key: 'thepaper',
        name: '澎湃新闻',
        apiUrl: 'https://m.thepaper.cn/api/touch/web/topnews',
        method: 'GET',
        enabled: true,
        priority: 9,
      },
      {
        key: 'cailianpress',
        name: '财联社',
        apiUrl: 'https://api-cls.eastmoney.com/kuaixun/v1/getlist_103_ajax',
        method: 'GET',
        enabled: true,
        priority: 10,
      },
      {
        key: 'xueqiu',
        name: '雪球',
        apiUrl: 'https://xueqiu.com/statuses/hot/listV2.json?since_id=-1&max_id=-1&size=15',
        method: 'GET',
        enabled: true,
        priority: 11,
      },
      {
        key: 'bilibili',
        name: 'B站',
        apiUrl: 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all',
        method: 'GET',
        enabled: true,
        priority: 12,
      },
      {
        key: 'kuaishou',
        name: '快手',
        apiUrl: 'https://www.kuaishou.com/api/feed/hot?appType=1&page=1&pageSize=20',
        method: 'GET',
        enabled: true,
        priority: 13,
      },
      {
        key: 'baidu',
        name: '百度热搜',
        apiUrl: 'https://top.baidu.com/api/board?tab=realtime',
        method: 'GET',
        enabled: true,
        priority: 14,
      },
      {
        key: 'nowcoder',
        name: '牛客',
        apiUrl: 'https://www.nowcoder.com/api/community/hot-list?type=1',
        method: 'GET',
        enabled: true,
        priority: 15,
      },
      {
        key: 'sspai',
        name: '少数派',
        apiUrl: 'https://sspai.com/api/v1/articles?sort=newest&limit=10',
        method: 'GET',
        enabled: true,
        priority: 16,
      },
      {
        key: 'ifeng',
        name: '凤凰网',
        apiUrl: 'https://api.ifeng.com/ipadtestdocdata/ipadindexspecial/0/',
        method: 'GET',
        enabled: true,
        priority: 17,
      },
      {
        key: 'douban',
        name: '豆瓣',
        apiUrl: 'https://frodo.douban.com/api/v2/subject_collection/movie_showing/items?start=0&count=10',
        method: 'GET',
        enabled: true,
        priority: 18,
      },
    ];

    for (const platform of defaultPlatforms) {
      await this.createPlatform(platform);
    }

    console.log('默认平台配置初始化完成');
  }
}

export const platformConfigManager = new PlatformConfigManager();
