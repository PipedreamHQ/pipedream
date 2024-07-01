"use client"

import { createRef, useEffect, useState } from "react";
import { serverConnectTokenCreate, getAppsData, getSpotifyData, getSlackData } from "./server"
import { createClient } from "../../../src/browser"

const PIPEDREAM_PROJECT_PUBLIC_KEY = process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY
if (!PIPEDREAM_PROJECT_PUBLIC_KEY) {
  throw new Error("Missing NEXT_PUBLIC_PIPEDREAM_PROJECT_PUBLIC_KEY env var")
}

const pd = createClient({
  publicKey: PIPEDREAM_PROJECT_PUBLIC_KEY,
})

export default function Home() {
  const [clientUserId, setClientUserId] = useState<string | null>(null)
  const [spotifyData, setSpotifyData] = useState<{ name: string, artist: string } | null>(null)
  const [slackData, setSlackData] = useState<{ display_name: string, image_original: string } | null>(null)
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
  const connectSpotify = async () => {
    if (!clientUserId) return
    const token = await serverConnectTokenCreate(clientUserId)
    pd.startConnect({
      app: "spotify",
      token: token,
      onSuccess: () => {
        getSpotifyData(clientUserId).then((d) => setSpotifyData(d))
      },
    })
  }
  const connectSlack = async () => {
    if (!clientUserId) return
    const token = await serverConnectTokenCreate(clientUserId)
    pd.startConnect({
      app: "slack",
      token: token,
      onSuccess: () => {
        getSlackData(clientUserId).then((d) => setSlackData(d))
      },
    })
  }
  const connectOtherApp = async () => {
    if (!clientUserId) return
    const token = await serverConnectTokenCreate(clientUserId)
    pd.startConnect({
      app,
      token: token,
    })
  }
  return (
    <main className="p-5 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Pipedream connect Next.js demo</h1>
      {!clientUserId ?
        <p><input className="border" ref={inputRef} placeholder="clientUserId" /> <button onClick={() => setClientUserId(inputRef.current?.value || "")} style={{all: "revert"}}>Sign in</button></p>
        : <div>
            <p>Signed in as: {clientUserId} <button onClick={() => setClientUserId(null)} style={{all: "revert"}}>Sign out</button></p>
            <p className="pt-2">Your recent top Spotify track: {spotifyData 
              ? <span><b>{spotifyData.name}</b> by <b>{spotifyData.artist}</b></span>
              : <button style={{all: "revert"}} onClick={connectSpotify}>Connect your Spotify account</button>}
            </p>
            <p className="pt-2">Your slack username: {slackData 
              ? <span><b>{slackData.display_name}</b><img src={slackData.image_original} /></span>
              : <button style={{all: "revert"}} onClick={connectSlack}>Connect your Slack account</button>}
            </p>
            <p className="pt-2">Connect another app: <input className="border" value={app} onInput={(e) => setApp(e.currentTarget.value)} placeholder="app_name_slug" /> <button style={{all: "revert"}} onClick={connectOtherApp}>Connect {app} account</button></p> 
          </div>
      }
    </main>
  );
}
