"use server";

import {
  createClient,
  type ConnectTokenCreateOpts, 
  type ConnectTokenResponse,
} from "@pipedream/sdk";

const {
  PIPEDREAM_API_HOST,
  PIPEDREAM_PROJECT_PUBLIC_KEY,
  PIPEDREAM_PROJECT_SECRET_KEY,
} = process.env;

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

export async function getUserAccounts(externalId: string, include_credentials: number = 0): Promise<void> {
  await pd.getAccountsByExternalId(externalId, {
    include_credentials, // set to 1 to include credentials
  })

  // Parse and return the data you need. These may contain credentials, 
  // which you should never return to the client
}
