CREATE TABLE "platform_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"api_url" text NOT NULL,
	"method" text DEFAULT 'GET',
	"enabled" boolean DEFAULT true,
	"priority" serial DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "platform_configs_key_unique" UNIQUE("key")
);
