"use client"

import { createRef, useEffect, useState } from "react";
import { serverConnectTokenCreate, getGithubData } from "./server"
import { createClient } from "../../../src/browser"

const publicKey = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY
const oauthAppId = process.env.NEXT_PUBLIC_PIPEDREAM_OAUTH_APP_ID

export default function Home() {
  if (!publicKey) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY env var")
  if (!oauthAppId) throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_OAUTH_APP_ID env var")

  const pd = createClient({ publicKey })
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
      token,
      onSuccess: ({ authProvisionId }: { authProvisionId: string }) => {
        setAuthProvisionId(authProvisionId)
      }
    })
  }

  useEffect(() => {
    if (!externalUserId) {
      setToken(null)
      setAuthProvisionId(null)
    } else if (!initialized) {
      serverConnectTokenCreate(externalUserId).then(setToken).finally(() => { setInitialized(true) })
    }
  }, [externalUserId])

  useEffect(() => {
    if (!apn) {
      setGithubData(null)
    } else {
      getGithubData(apn).then(setGithubData)
    }
  }, [apn])

  return (
    <main className="p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Pipedream connect Next.js demo</h1>
      <div>
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
