"use server";

import { createClient } from "../../../src";

const { PIPEDREAM_PROJECT_SECRET_KEY } = process.env;

if (!PIPEDREAM_PROJECT_SECRET_KEY) {
  throw new Error("PIPEDREAM_PROJECT_SECRET_KEY not set in environment");
}

const pd = createClient({
  fetch: fetch,
  secretKey: PIPEDREAM_PROJECT_SECRET_KEY,
});

export async function serverConnectTokenCreate(clientUserId: string) {
  return pd.connectTokenCreate({
    clientName: "Next.js Example App",
    clientUserId,
  });
}

export async function getAppsData(clientUserId: string) {
  const [
    spotify,
    slack,
  ] = await Promise.all([
    getSpotifyData(clientUserId),
    getSlackData(clientUserId),
  ]);
  return {
    spotify,
    slack,
  };
}

export async function getSpotifyData(clientUserId: string) {
  const data = await pd.getAccount({
    app: "spotify",
    clientUserId,
  }, {
    includeCredentials: true,
  });
  if (!data) {
    return null;
  }
  const resp = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=1", {
    headers: {
      Authorization: `Bearer ${data.credentials.oauth_access_token}`,
    },
  });
  const res = await resp.json();
  const item = res.items[0];
  if (!item) {
    return null;
  }
  return {
    name: item.album.name,
    artist: item.album.artists[0].name,
  };
}

export async function getSlackData(clientUserId: string) {
  const data = await pd.getAccount({
    app: "slack",
    clientUserId,
  }, {
    includeCredentials: true,
  });
  if (!data) {
    return null;
  }
  const resp = await fetch("https://slack.com/api/users.profile.get", {
    headers: {
      Authorization: `Bearer ${data.credentials.oauth_access_token}`,
    },
  });
  const res = await resp.json();
  return {
    display_name: res.profile.display_name,
    image_original: res.profile.image_original,
  };
}
