import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const platformConfigs = pgTable('platform_configs', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  apiUrl: text('api_url').notNull(),
  method: text('method').default('GET'),
  enabled: boolean('enabled').default(true),
  priority: serial('priority').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type PlatformConfig = typeof platformConfigs.$inferSelect;
export type NewPlatformConfig = typeof platformConfigs.$inferInsert;
