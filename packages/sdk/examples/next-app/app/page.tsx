"use client"

import { createRef, useEffect, useState } from "react";
import { serverConnectTokenCreate, getAppsData } from "./server"
import { createClient } from "../../../src/browser"

const frontendHost = process.env.NEXT_PUBLIC_PIPEDREAM_FRONTEND_HOST
const oauthAppId = process.env.NEXT_PUBLIC_PIPEDREAM_APP_ID
const appSlug = process.env.NEXT_PUBLIC_PIPEDREAM_APP_SLUG

export default function Home() {
  //if (!oauthAppId) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_APP_ID env var")

  const pd = createClient({ frontendHost })
  const [externalUserId, setExternalUserId] = useState<string | null>(null)
  const [githubData, setGithubData] = useState<{ login: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [oa, setOauthAppId] = useState<string | null>(null)
  const [app, setApp] = useState<string | null>(null)
  const [apn, setAuthProvisionId] = useState<string | null>(null)
  const inputRef = createRef<HTMLInputElement>()

  const connectApp = (app: string, oauthAppId: string) => {
    //debugger
    if (!externalUserId || !token) return
    setApp(app)
    setOauthAppId(oauthAppId)
    pd.startConnect({
      app,
      token,
      onSuccess: ({ id: authProvisionId }: any) => {
        setAuthProvisionId(authProvisionId as string)
      }
    })
  }

  const connectAccount = async () => {
    await connectApp(appSlug as string, oauthAppId as string)
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
        app_slug: appSlug,
        oauth_client_id: oauthAppId,
        external_id: externalUserId
      }).then((t) => setToken(t.token))
      getAppsData(externalUserId).then((d) => {
        setGithubData(d.github)
      })
    }
  }, [externalUserId])


  return (
    <main className="p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Pipedream connect Next.js demo</h1>
      {
        externalUserId ?
          <div>
            <p>External User Id: {externalUserId} </p>
            <p>Token: {token}</p>

            {apn ?
              <div>
                <p>
                  Auth Provision Id: {apn}
                </p>
                <p>
                  Oauth App Id: {oa}
                </p>
                <p>
                  <button onClick={signOut} style={{ all: "revert" }}>Sign out</button>
                </p>
              </div>
              : <button style={{ all: "revert" }} onClick={connectAccount}>Connect your GitHub account</button>
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
    </main>
  );
}
