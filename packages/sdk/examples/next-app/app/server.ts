"use server";

import {
  createClient,
  type ConnectTokenCreateOpts, 
  type ConnectTokenResponse,
} from "../../../src/server/index"//"@pipedream/sdk";

const {
  PIPEDREAM_API_HOST,
  PIPEDREAM_PROJECT_PUBLIC_KEY,
  PIPEDREAM_PROJECT_SECRET_KEY,
} = process.env;

import apps from "./apps.json"
//console.log("hello world")
//console.log("apps", apps)

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
  return pd.getAccountsByExternalId(externalId, {
    include_credentials, // set to 1 to include credentials
  })

  // Parse and return the data you need. These may contain credentials, 
  // which you should never return to the client
}

export async function getTestRequest(nameSlug) {
  const appData = apps[nameSlug]
  if (appData) {
    const headers = appData.header_params.reduce((acc, header) => {
      acc[header.key] = header.value
      return acc
    }, {})

    if (appData.auth?.type === "bearer") {
      headers.authorization = "Bearer ${oauth_access_token}"
    } else if (appData.auth?.type === "basic") {
      // get username and password
      const regex = /{{custom_fields\.(\w+)}}/
      const userMatch = appData.auth.basic_username.match(regex)
      const passMatch = appData.auth.basic_password.match(regex)

      const user = userMatch ? userMatch[1] : ""
      const pass = passMatch ? passMatch[1] : ""

//      const value = `\${Buffer.from(\`${user}:${pass}\`).toString("base64")}`
      const value = `Basic Base64(${user}:${pass}) // use the given values for basic auth`

      headers.authorization = value
    } else {
      // null, do nothing?
    }
    return {
      config: {
        method: appData.method,
        headers,
      },
      url: appData.url,
      authType: appData.auth?.type,
    }
  } else {
    return {}
  }
}

export async function makeAppRequest(accountId: string, endpoint: string, nameSlug: string, opts: Object): Promise {
  const oauthToken = await pd.getAccount(accountId, {include_credentials: 1})
  const appData = apps[nameSlug]
  const headers = {
    authorization: `Bearer ${oauthToken.credentials?.oauth_access_token}`,
    "content-type": "application/json",
  }
  if (appData && appData.auth?.type === "basic") {
    const regex = /{{custom_fields\.(\w+)}}/
    const userMatch = appData.auth.basic_username.match(regex)
    const passMatch = appData.auth.basic_password.match(regex)

    const user = userMatch ? userMatch[1] : null
    const pass = passMatch ? passMatch[1] : null

    const username = user ? oauthToken.credentials[user] : ""
    const password = pass ? oauthToken.credentials[pass] : ""
    const buffer = `${username}:${password}`
    headers.authorization = `Basic ${Buffer.from(buffer).toString("base64")}`
  }
  const config = {
    method: opts.method || "GET",
    headers: {
      ...headers,
      ...opts.headers,
    },
  }

  if(opts.method != "GET") {
    config.body = opts.body
  }
  const resp: Response = await fetch(endpoint.toString(), config)

  const result = await resp.json()

  return result
}

export async function serverConnectGetApps(): Promise {
  const apps = await pd.getLinkedApps()
  return apps
}

