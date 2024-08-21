"use client"

import CodePanel from "./CodePanel";
import { useEffect, useState } from "react";
import { serverConnectTokenCreate } from "./server"
import { createClient } from "@pipedream/sdk/browser"

const frontendHost = process.env.NEXT_PUBLIC_PIPEDREAM_FRONTEND_HOST || "pipedream.com"
const appSlug = process.env.NEXT_PUBLIC_PIPEDREAM_APP_SLUG // required
const oauthAppId = process.env.NEXT_PUBLIC_PIPEDREAM_APP_ID // required only for oauth connections

export default function Home() {
  const pd = createClient({ frontendHost })
  const [externalUserId, setExternalUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [app, setApp] = useState<string | null>(null)
  const [apn, setAuthProvisionId] = useState<string | null>(null)

    
  const connectApp = (app: string) => {
    if (!externalUserId) {
      throw new Error("External user ID is required.");
    }
    if (!token) {
      throw new Error("Token is required.");
    }
    setApp(app)
    pd.connectAccount({
      app,
      token,
      onSuccess: ({ id: authProvisionId }) => {
        setAuthProvisionId(authProvisionId as string)
      }
    })
  }

  const connectAccount = async () => {
    if (!appSlug) return
    await connectApp(appSlug)
  }

  useEffect(() => {
    setExternalUserId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (!externalUserId) {
      setToken(null)
      setAuthProvisionId(null)
    } else {
      if (!appSlug) return
      (async () => {
        try {
          const { token, expires_at } = await serverConnectTokenCreate({
            app_slug: appSlug,
            oauth_app_id: oauthAppId,
            external_user_id: externalUserId
          })
          setToken(token)
          setExpiresAt(expires_at)
        } catch (error) {
          console.error("Error fetching data:", error)
          // Handle error appropriately
        }
      })()
    }
  }, [externalUserId])


  return (
    <main className="p-5 flex flex-col gap-2 max-w-5xl">
      {
        (!appSlug) &&
        <div className="flex flex-col gap-2 text-slate-800 pb-4">
          <div>
            <p>
              The <code>NEXT_PUBLIC_PIPEDREAM_APP_ID</code> variable is not set in your environment. Copy the <code>.env.example</code> file in this directory and fill in the appropriate environment variables.
            </p>
            <CodePanel
              language="plaintext"
              code={`# Config for the Next.js app
# Key based apps only require the app_slug value. OAuth apps require both.
NEXT_PUBLIC_PIPEDREAM_APP_SLUG=github
NEXT_PUBLIC_PIPEDREAM_APP_ID=oa_abc123

# Project credentials — used to authenticate with the Pipedream API.
# These are scoped to the server-side only.
PIPEDREAM_PROJECT_PUBLIC_KEY=pub_abc123
PIPEDREAM_PROJECT_SECRET_KEY=sec_abc123`}
            />
          </div>
        </div>
      }
      {
        appSlug && externalUserId && 
        <div className="mb-48">
          <h1 className="text-2xl font-bold mb-8">Pipedream Connect Example App</h1>
          <div className="mb-8">
            <p>Refer to the <a href="https://pipedream.com/docs/connect" target="_blank nofollow" className="hover:underline text-blue-600">Pipedream Connect docs</a> for a full walkthrough of how to configure Connect for your site. This example app implements Connect in a Next.js (React) app.</p>
          </div>
          <div className="mb-8">
            <p>When your customers connect accounts with Pipedream, you&apos;ll pass their unique user ID in your system — whatever you use to identify them. In this example, we generate a random external user ID for you.</p>
          </div>
          <div className="mb-8">
            <span className="font-semibold">External User ID:</span>
            <span className="font-mono"> {externalUserId}</span>
          </div>
          <div className="mb-8">
            <p>In <code>server.ts</code>, the app calls <code>serverConnectTokenCreate</code> to create a short-lived token for the user. You&apos;ll use that token to initiate app connection requests from your site securely. SEE THE DOCS.</p>
          </div>
          <div className="mb-8">
            <CodePanel
              language="typescript"
              code={`import { connectTokenCreate } from "@pipedream/sdk";

const { token, expires_at } = await serverConnectTokenCreate({
  app_slug: "github",
  oauth_app_id: "oa_abc123",  // Only required for OAuth apps
  external_user_id: "${externalUserId}",
})`}
            />
          </div>
          <div className="mb-2">
            <span className="font-semibold">Connect Token:</span>
            <span className="font-mono"> {token}</span>
          </div>
          <div className="mb-8">
            <span className="font-semibold">Expires at:</span>
            <span className="font-mono"> {expiresAt}</span>
          </div>
          <p className="mb-8">
            When a user wants to connect an app from your frontend, you&apos;ll call <code>pd.connectAccount</code> with the token and the OAuth App ID of the app you&apos;d like to connect.
          </p>
          <div className="mb-8">
            <CodePanel
              language="typescript"
              code={`import { createClient } from "@pipedream/sdk/browser";

const pd = createClient();
pd.connectAccount({
  app,
  token,
  onSuccess: () => {
    console.log("Connected!")
  }
})`}
            />
          </div>
          {apn ?
            <div>
              <p>
                <span className="font-semibold">Pipedream Account ID:</span>
                <span className="font-mono"> {apn}</span>
              </p>
            </div>
            : <div>
              <p className="mb-8">
              </p>
              <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded" onClick={connectAccount}>Connect your {app} account</button>
            </div>
          }
        </div>
      }
    </main>
  );
}
