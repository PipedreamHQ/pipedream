import { createClient as serverClient } from "pipedream/packages/sdk/src"
import { createClient as browserClient } from "pipedream/packages/sdk/src/browser"

const { PIPEDREAM_PROJECT_PUBLIC_KEY, PIPEDREAM_PROJECT_SECRET_KEY } = process.env

export const pdServer = () => {
  if(!PIPEDREAM_PROJECT_PUBLIC_KEY || !PIPEDREAM_PROJECT_SECRET_KEY) {
    throw new Error("Missing PIPEDREAM_PROJECT_PUBLIC_KEY or PIPEDREAM_PROJECT_SECRET")
  }
  return serverClient({
    apiHost: "api.pipedream.com",
    publicKey: PIPEDREAM_PROJECT_PUBLIC_KEY,
    secretKey: PIPEDREAM_PROJECT_SECRET_KEY,
  })
}

export const pdBrowser = () => {
  if(!PIPEDREAM_PROJECT_PUBLIC_KEY) {
    throw new Error("Missing PIPEDREAM_PROJECT_PUBLIC_KEY")
  }
  return browserClient({
    publicKey: PIPEDREAM_PROJECT_PUBLIC_KEY,
  })
}
