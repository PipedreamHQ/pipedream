"use server";

import {
  createClient,
  type ConnectTokenCreateOpts,
  type ConnectTokenResponse,
} from "../../../src";

const {
  PIPEDREAM_API_HOST,
  PIPEDREAM_PROJECT_PUBLIC_KEY,
  PIPEDREAM_PROJECT_SECRET_KEY,
  NEXT_PUBLIC_PIPEDREAM_APP_SLUG,
} = process.env;

if (!NEXT_PUBLIC_PIPEDREAM_APP_SLUG)
  throw new Error("NEXT_PUBLIC_PIPEDREAM_APP_SLUG not set in environment");
if (!PIPEDREAM_PROJECT_PUBLIC_KEY)
  throw new Error("PIPEDREAM_PROJECT_PUBLIC_KEY not set in environment");
if (!PIPEDREAM_PROJECT_SECRET_KEY)
  throw new Error("PIPEDREAM_PROJECT_SECRET_KEY not set in environment");

const pd = createClient({
  publicKey: PIPEDREAM_PROJECT_PUBLIC_KEY,
  secretKey: PIPEDREAM_PROJECT_SECRET_KEY,
  apiHost: PIPEDREAM_API_HOST,
});

export async function serverConnectTokenCreate(opts: ConnectTokenCreateOpts): Promise<ConnectTokenResponse> {
  return pd.connectTokenCreate(opts);
}

export async function getUserAccounts(externalId: string) {
  const data = await pd.getAccount({
    externalId,
    includeCredentials: true,
  })
  if (!data?.accounts.length) {
    return null;
  }

  // Parse and return data?.accounts. These may contain credentials, 
  // which you should never return to the client
}
