"use client"

import { createRef, useEffect, useState } from "react";
import { serverConnectTokenCreate, getAppsData } from "./server"
import { createClient } from "../../../src/browser"

const frontendHost = process.env.NEXT_PUBLIC_PIPEDREAM_FRONTEND_HOST
const oauthAppId = process.env.NEXT_PUBLIC_PIPEDREAM_APP_ID

export default function Home() {
  if (!oauthAppId) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_APP_ID env var")

  const pd = createClient({ frontendHost })
  const [externalUserId, setExternalUserId] = useState<string | null>(null)
  const [githubData, setGithubData] = useState<{ login: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [oa, setOauthAppId] = useState<string | null>(null)
  const [apn, setAuthProvisionId] = useState<string | null>(null)
  const inputRef = createRef<HTMLInputElement>()

  const connectApp = (app: string) => {
    if (!externalUserId || !token) return
    setOauthAppId(app)
    pd.startConnect({
      app,
      token,
      onSuccess: ({ id: authProvisionId }: any) => {
        setAuthProvisionId(authProvisionId as string)
      }
    })
  }

  const connectAccount = async () => {
    await connectApp(oauthAppId as string)
  }

  const signIn = () => {
    setExternalUserId(inputRef.current?.value || "")
  }

  const signOut = () => {
    setExternalUserId(null)
  }

  // Reactive Effects
  useEffect(() => {
    if (!externalUserId) {
      setToken(null)
      setGithubData(null)
      setOauthAppId(null)
      setAuthProvisionId(null)
    } else {
      serverConnectTokenCreate({
        app_id: oauthAppId,
        external_id: externalUserId
      }).then((t) => setToken(t))
      getAppsData(externalUserId).then((d) => {
        setGithubData(d.github)
      })
    }
  }, [externalUserId])


  return (
    <main className="p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Pipedream Connect Example App</h1>
      <div className="flex flex-col gap-2 text-slate-800 pb-4">
        <p>Something about making sure to configure the `.env.local` file...</p>
      </div>
      {
        externalUserId ?
          <div>
            <p>
              <span className="font-semibold">External User ID:</span>
              <span className="font-mono"> {externalUserId}</span>
            </p>
            <p>
              <span className="font-semibold">Connect Token:</span>
              <span className="font-mono"> {token}</span>
            </p>
            {apn ?
              <div>
                <p>
                  <span className="font-semibold">Auth Provision ID:</span>
                  <span className="font-mono"> {apn}</span>
                </p>
                <p>
                  <span className="font-semibold">OAuth App ID:</span>
                  <span className="font-mono"> {oa}</span>
                </p>
                <p>
                  <button onClick={signOut} style={{ all: "revert" }}>Sign out</button>
                </p>
              </div>
              : <button style={{ all: "revert" }} onClick={connectAccount}>Connect your account</button>
            }
            {
              githubData?.login &&
              <p className="pt-2">Your GitHub username:
                <span><b>{githubData.login}</b></span>
              </p>
            }
            <p>
            </p>
          </div>
          :
          <div>
            <p>
              <input className="border" ref={inputRef} placeholder="External user id" />
            </p>
            <p>
              <button onClick={signIn} style={{ all: "revert" }}>Sign in</button>
            </p>
          </div>

      }
      <div className="flex flex-col gap-2 text-slate-800 pt-4">
        <p>Refer to the <a href="https://pipedream.com/docs/connect" target="_blank nofollow" className="hover:underline text-blue-600">Pipedream Connect docs</a> for any questions</p>
      </div>
    </main>
  );
}
