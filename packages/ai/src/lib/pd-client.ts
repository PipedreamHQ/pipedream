import { createBackendClient } from "@pipedream/sdk";
import { config } from "./config";

export const pd = createBackendClient({
  credentials: {
    clientId: config.PIPEDREAM_CLIENT_ID,
    clientSecret: config.PIPEDREAM_CLIENT_SECRET,
  },
  projectId: config.PIPEDREAM_PROJECT_ID,
  environment: config.PIPEDREAM_PROJECT_ENVIRONMENT,
});
