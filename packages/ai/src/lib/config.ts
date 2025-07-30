import { z } from "zod";

const configSchema = z.object({
  PIPEDREAM_CLIENT_ID: z.string().min(1, {
    message: "PIPEDREAM_CLIENT_ID is required",
  }),
  PIPEDREAM_CLIENT_SECRET: z.string().min(1, {
    message: "PIPEDREAM_CLIENT_SECRET is required",
  }),
  PIPEDREAM_PROJECT_ID: z.string().min(1, {
    message: "PIPEDREAM_PROJECT_ID is required",
  }),
  PIPEDREAM_PROJECT_ENVIRONMENT: z.enum([
    "development",
    "production",
  ]),
});

export const config = configSchema.parse(process?.env);

export type Config = z.infer<typeof configSchema>;
