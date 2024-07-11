"use client"

import { createRef, useEffect, useState } from "react";
import { serverConnectTokenCreate, getAppsData } from "./server"
import { createClient } from "../../../src/browser"

const publicKey = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY
const frontendHost = process.env.NEXT_PUBLIC_PIPEDREAM_FRONTEND_HOST
const oauthAppId = process.env.NEXT_PUBLIC_PIPEDREAM_TEST_APP_ID
const appSlug = process.env.NEXT_PUBLIC_PIPEDREAM_APP_SLUG
const orgId = process.env.NEXT_PUBLIC_PIPEDREAM_ORG_ID

export default function Home() {
  if (!orgId) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_ORG_ID env var")
  if (!publicKey) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY env var")
  if (!oauthAppId) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_TEST_APP_ID env var")
  if (!appSlug) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_APP_SLUG env var")

  const pd = createClient({ publicKey, frontendHost, orgId })
  const [externalUserId, setExternalUserId] = useState<string | null>(null)
  const [githubData, setGithubData] = useState<{ login: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [apn, setAuthProvisionId] = useState<string | null>(null)
  const inputRef = createRef<HTMLInputElement>()

  const [initialized, setInitialized] = useState(false)


  const signIn = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setExternalUserId(inputRef.current?.value || "")
  }

  const connectApp = () => {
    if (!externalUserId || !token) return
    pd.startConnect({
      app: oauthAppId,
      token,
      onSuccess: ({ id: authProvisionId }: any) => {
        setAuthProvisionId(authProvisionId as string)
      }
    })
  }

  useEffect(() => {
    if (!externalUserId) {
      setToken(null)
      setGithubData(null)
      setAuthProvisionId(null)
    } else if (!initialized) {
      Promise.all([
        serverConnectTokenCreate(externalUserId).then((t) => setToken(t)),
        getAppsData(externalUserId).then((d) => {
          setGithubData(d.github)
        })
      ]).finally(() => { setInitialized(true) })
    }
  }, [externalUserId])

  return (
    <main className="p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Pipedream connect Next.js demo</h1>
      <div>
        <p>Org Id: {orgId} </p>
        <p>Project Key: {publicKey} </p>
        <p>Oauth App Id: {oauthAppId}</p>
      </div>
      {
        externalUserId ?
          <form>
            <p>External User Id: {externalUserId} </p>
            <p>
              <button onClick={() => setExternalUserId(null)} style={{ all: "revert" }}>Sign out</button>
            </p>
          </form>
          :
          <form>
            <p>
              <input className="border" ref={inputRef} placeholder="External user id" />
            </p>
            <p>
              <button type="submit" onClick={signIn} style={{ all: "revert" }}>Sign in</button>
            </p>
          </form>

      }
      {
        initialized && <div>
          {token && <p>Token: {token}</p>}
          {
            githubData?.login
              ? <p>Your GitHub username: <b>{githubData.login}</b></p>
              : externalUserId && token && !apn &&
              <p>
                <button style={{ all: "revert" }} onClick={connectApp}>Connect your GitHub account</button>
              </p>
          }
        </div>
      }
      <div>
        {
          apn &&
          <div>
            <p><b>Connected your account to Pipedream!</b></p>
            <p>Auth Provision Id: {apn}</p>
          </div>
        }
      </div>
    </main>
  );
}
