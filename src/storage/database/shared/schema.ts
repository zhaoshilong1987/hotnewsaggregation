import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"

export const platformConfigs = pgTable('platform_configs', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  apiUrl: text('api_url').notNull(),
  method: text('method').notNull().default('GET'),
  enabled: boolean('enabled').notNull().default(true),
  priority: serial('priority').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// TypeScript types
export type PlatformConfig = typeof platformConfigs.$inferSelect;
export type NewPlatformConfig = typeof platformConfigs.$inferInsert;

// Zod schemas
const { createInsertSchema, createUpdateSchema } = createSchemaFactory({
  coerce: { date: true },
});

export const insertPlatformConfigSchema = createInsertSchema(platformConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePlatformConfigSchema = createUpdateSchema(platformConfigs).omit({
  id: true,
  createdAt: true,
});

export type InsertPlatformConfig = typeof insertPlatformConfigSchema.type;
export type UpdatePlatformConfig = typeof updatePlatformConfigSchema.type;
