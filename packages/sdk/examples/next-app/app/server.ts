"use server";

import { createClient } from "../../../src";

const {
  PIPEDREAM_PROJECT_ID,
  PIPEDREAM_PROJECT_SECRET_KEY,
  NEXT_PUBLIC_PIPEDREAM_OAUTH_APP_ID,
} = process.env;

if (!PIPEDREAM_PROJECT_ID) throw new Error("PIPEDREAM_PROJECT_ID not set in environment");
if (!PIPEDREAM_PROJECT_SECRET_KEY) throw new Error("PIPEDREAM_PROJECT_SECRET_KEY not set in environment");
if (!NEXT_PUBLIC_PIPEDREAM_OAUTH_APP_ID) throw new Error("NEXT_PUBLIC_PIPEDREAM_OAUTH_APP_ID not set in environment");
const oauthAppId = NEXT_PUBLIC_PIPEDREAM_OAUTH_APP_ID
const projectId = PIPEDREAM_PROJECT_ID

const pd = createClient({
  projectId, // Basic Authorization
  secretKey: PIPEDREAM_PROJECT_SECRET_KEY, // Basic Authorization
  apiHost: process.env.PIPEDREAM_API_HOST || "api.pipedream.com",
});

export async function serverConnectTokenCreate(externalId: string) {
  return pd.connectTokenCreate({
    externalId,
    oauthAppId
  });
}


export async function getAccount(authProvisionId: string) {
  try {
    const data = await pd.getAccount({ authProvisionId, projectId });
    return data.accounts
  } catch (error) {
    throw new Error("Failed to Fetch Pipedream Accounts")
  }
}

export async function getGithubData(authProvisionId: string) {
  const accounts = await getAccount(authProvisionId)
  const account = accounts[accounts.length - 1]
  try {
    const resp = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${account.credentials.oauth_access_token}`,
      },
    });
    return await resp.json();
  } catch (error) {
    throw new Error("Failed to Fetch Github Data")
  }
}
