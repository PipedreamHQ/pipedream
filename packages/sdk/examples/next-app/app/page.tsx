"use client"

import { createRef, useEffect, useState } from "react";
import { serverConnectTokenCreate, getAppsData, getSpotifyData, getSlackData } from "./server"
import { createClient } from "../../../src/browser"

const PIPEDREAM_PROJECT_PUBLIC_KEY = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY
const PIPEDREAM_TEST_APP_ID = process.env.NEXT_PUBLIC_PIPEDREAM_TEST_APP_ID
if (!PIPEDREAM_PROJECT_PUBLIC_KEY) {
  throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY env var")
}
if (!PIPEDREAM_TEST_APP_ID) {
  throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_TEST_APP_ID env var")
}

const pd = createClient({
  publicKey: PIPEDREAM_PROJECT_PUBLIC_KEY,
  frontendHost: process.env.NEXT_PUBLIC_PIPEDREAM_FRONTEND_HOST,
})

export default function Home() {
  const [clientUserId, setClientUserId] = useState<string | null>(null)
  const [spotifyData, setSpotifyData] = useState<{ name: string, artist: string } | null>(null)
  const [slackData, setSlackData] = useState<{ display_name: string, image_original: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [app, setApp] = useState<string>("")
  const inputRef = createRef<HTMLInputElement>()
  useEffect(() => {
    if (!clientUserId) {
      setSpotifyData(null)
      setSlackData(null)
    } else {
      getAppsData(clientUserId).then((d) => {
        setSpotifyData(d.spotify)
        setSlackData(d.slack)
      })
    }
  }, [clientUserId])

  useEffect(() => {
    if (!clientUserId) return
    serverConnectTokenCreate(clientUserId).then((t) => setToken(t))
  }, [clientUserId])

  const connectApp = (app: string) => {
    if (!clientUserId || !token) return
    pd.startConnect({
      app,
      token,
      onSuccess: () => {
        console.log(`Connected ${app} account for ${clientUserId}`)
      }
    })
  }

  const connectSlack = async () => {
    if (!PIPEDREAM_TEST_APP_ID) {
      console.log("Missing NEXT_PUBLIC_PIPEDREAM_TEST_APP_ID env var")
      return
    }
    connectApp(PIPEDREAM_TEST_APP_ID)
  } 
  return (
    <main className="p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Pipedream connect Next.js demo</h1>
      {!clientUserId ?
        <p><input className="border" ref={inputRef} placeholder="clientUserId" /> <button onClick={() => setClientUserId(inputRef.current?.value || "")} style={{all: "revert"}}>Sign in</button></p>
        : <div>
            <p>Signed in as: {clientUserId} <button onClick={() => setClientUserId(null)} style={{all: "revert"}}>Sign out</button></p>
            <p>Token: {token}</p>
            <p className="pt-2">Your slack username: {slackData 
              ? <span><b>{slackData.display_name}</b><img src={slackData.image_original} /></span>
              : <button style={{all: "revert"}} onClick={connectSlack}>Connect your Slack account</button>}
            </p>
          </div>
      }
    </main>
  );
}
