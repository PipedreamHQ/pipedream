"use server";

import {
  createClient,
  type ConnectTokenCreateOpts,
} from "../../../src";

const {
  NEXT_PUBLIC_PIPEDREAM_APP_ID,
  PIPEDREAM_API_HOST,
  PIPEDREAM_PROJECT_PUBLIC_KEY,
  PIPEDREAM_PROJECT_SECRET_KEY,
  NEXT_PUBLIC_PIPEDREAM_APP_SLUG,
  PIPEDREAM_PROJECT_ID,
  NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY,
  NEXT_PUBLIC_PIPEDREAM_TEST_APP_ID,
} = process.env;

//if (!NEXT_PUBLIC_PIPEDREAM_APP_ID)
//  throw new Error("NEXT_PUBLIC_PIPEDREAM_APP_ID not set in environment");
if (!PIPEDREAM_PROJECT_PUBLIC_KEY)
  throw new Error("PIPEDREAM_PROJECT_SECRET_KEY not set in environment");
if (!PIPEDREAM_PROJECT_SECRET_KEY)
  throw new Error("PIPEDREAM_PROJECT_SECRET_KEY not set in environment");

const pd = createClient({
  secretKey: PIPEDREAM_PROJECT_SECRET_KEY,
  apiHost: PIPEDREAM_API_HOST,
  publicKey: PIPEDREAM_PROJECT_PUBLIC_KEY,
});

export async function serverConnectTokenCreate(opts: ConnectTokenCreateOpts) {
  const token = pd.connectTokenCreate(opts);
  console.log("connect token", token);
  return token
}

export async function getAppsData(externalId: string) {
  const [
    github,
  ] = await Promise.all([
    getGithubData(externalId),
  ]);
  return {
    github,
  };
}

export async function getGithubData(externalId: string) {
  //if (!NEXT_PUBLIC_PIPEDREAM_APP_ID)
    //throw new Error("NEXT_PUBLIC_PIPEDREAM_APP_ID not set in environment");

  const data = await pd.getAccount({
    appId: NEXT_PUBLIC_PIPEDREAM_APP_SLUG,
    externalId,
  }, {
    includeCredentials: true,
  });
  if (!data?.accounts.length) {
    return null;
  }
  const account = data.accounts[data.accounts.length - 1];
  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${account.credentials.oauth_access_token}`,
    },
  });
  const res = await resp.json();

  return res;
}
