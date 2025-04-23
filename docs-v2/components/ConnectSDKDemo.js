"use client";

import {
  useState, useEffect,
} from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";

// Generate a UUID v4 for use as external_user_id
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x"
      ? r
      : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function ConnectSDKDemo() {
  // User and account state
  const [
    appSlug,
    setAppSlug,
  ] = useState("slack");
  const [
    externalUserId,
    setExternalUserId,
  ] = useState("");
  const [
    connectedAccount,
    setConnectedAccount,
  ] = useState(null);

  // Token state
  const [
    tokenData,
    setTokenData,
  ] = useState(null);

  // UI state
  const [
    tokenLoading,
    setTokenLoading,
  ] = useState(false);
  const [
    error,
    setError,
  ] = useState(null);

  // Generate a new UUID when the component mounts
  useEffect(() => {
    setExternalUserId(generateUUID());
  }, []);

  // Format token data for display
  const getFormattedTokenSnippet = () => {
    if (!tokenData) return null;
    return JSON.stringify(tokenData, null, 2);
  };

  // Generate server-side code snippet with the current external user ID
  const getServerCodeSnippet = () => {
    return `import { createBackendClient } from "@pipedream/sdk/server";
 
// This code runs on your server
const pd = createBackendClient({
  environment: "development", 
  credentials: {
    clientId: process.env.PIPEDREAM_CLIENT_ID,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
  },
  projectId: process.env.PIPEDREAM_PROJECT_ID
});
 
// Create a token for a specific user
const { token, expires_at, connect_link_url } = await pd.createConnectToken({
  external_user_id: "${externalUserId || "YOUR_USER_ID"}", 
});`;
  };

  // Generate client-side code snippet with the current app and token
  const getClientCodeSnippet = () => {
    return `import { createFrontendClient } from "@pipedream/sdk/browser"
 
// This code runs in the browser
const pd = createFrontendClient()

// Connect an account using the token from your server
pd.connectAccount({
  app: "${appSlug}", 
  token: "${tokenData?.token
    ? tokenData.token.substring(0, 10) + "..."
    : "YOUR_TOKEN"}", // The token from your server
  onSuccess: (account) => {
    // Handle successful connection
    console.log(\`Account successfully connected: \${account.name}\`)
  },
  onError: (err) => {
    // Handle connection error
    console.error(\`Connection error: \${err.message}\`)
  },
  onClose: () => {
    // Handle dialog closed by user
  }
})`;
  };

  async function generateToken() {
    setTokenLoading(true);
    setError(null);

    try {
      // This is executed server-side in our API route
      const response = await fetch("/docs/api-demo-connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          external_user_id: externalUserId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get token");
      }

      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setTokenLoading(false);
    }
  }

  function connectAccount() {
    if (!tokenData?.token) {
      setError("Please generate a token first");
      return;
    }

    setError(null);

    try {
      // Use the token to connect an account
      const pd = createFrontendClient();
      pd.connectAccount({
        app: appSlug,
        token: tokenData.token,
        onSuccess: (account) => {
          setConnectedAccount(account);
        },
        onError: (err) => {
          setError(err.message || "Failed to connect account");
        },
        onClose: () => {
          // Dialog closed by user - no action needed
        },
      });
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  }

  return {
    externalUserId,
    tokenData,
    connectedAccount,
    error,
    tokenLoading,
    isTokenGenerated: !!tokenData,
    appOptions: [
      {
        value: "slack",
        label: "Slack",
      },
      {
        value: "github",
        label: "GitHub",
      },
      {
        value: "google_sheets",
        label: "Google Sheets",
      },
    ],
    actions: {
      generateToken,
      connectAccount,
      setAppSlug,
    },
    codeSnippets: {
      server: getServerCodeSnippet(),
      client: getClientCodeSnippet(),
      tokenResponse: getFormattedTokenSnippet(),
    },
  };
}
