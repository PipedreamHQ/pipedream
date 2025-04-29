"use server";

import {
  createBackendClient,
  type ProjectEnvironment,
} from "@pipedream/sdk/server";

const {
  NODE_ENV,
  PIPEDREAM_ALLOWED_ORIGINS,
  PIPEDREAM_CLIENT_ID,
  PIPEDREAM_CLIENT_SECRET,
  PIPEDREAM_PROJECT_ID,
} = process.env;

if (!NODE_ENV) {
  throw new Error("NODE_ENV is required");
}

if (!PIPEDREAM_ALLOWED_ORIGINS) {
  throw new Error("PIPEDREAM_ALLOWED_ORIGINS is required");
}

let allowedOrigins: string[] = [];
try {
  allowedOrigins = JSON.parse(PIPEDREAM_ALLOWED_ORIGINS);
} catch {
  throw new Error("PIPEDREAM_ALLOWED_ORIGINS must be a valid JSON array");
}
if (!Array.isArray(allowedOrigins)) {
  throw new Error("PIPEDREAM_ALLOWED_ORIGINS must be a JSON array");
}

if (!PIPEDREAM_CLIENT_ID) {
  throw new Error("PIPEDREAM_CLIENT_ID is required");
}

if (!PIPEDREAM_CLIENT_SECRET) {
  throw new Error("PIPEDREAM_CLIENT_SECRET is required");
}

if (!PIPEDREAM_PROJECT_ID) {
  throw new Error("PIPEDREAM_PROJECT_ID is required");
}

const client = createBackendClient({
  environment: NODE_ENV as ProjectEnvironment,
  projectId: PIPEDREAM_PROJECT_ID,
  credentials: {
    clientId: PIPEDREAM_CLIENT_ID,
    clientSecret: PIPEDREAM_CLIENT_SECRET,
  },
});

export async function fetchToken(opts: { externalUserId: string; }) {
  return await client.createConnectToken({
    external_user_id: opts.externalUserId,
    allowed_origins: allowedOrigins,
  });
}
