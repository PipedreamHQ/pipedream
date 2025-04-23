"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";

// Generate a UUID v4 for use as external_user_id
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Create the context
const ConnectDemoContext = createContext(null);

// Provider component
export function ConnectDemoProvider({ children }) {
  // User and account state
  const [appSlug, setAppSlug] = useState("slack");
  const [externalUserId, setExternalUserId] = useState("");
  const [connectedAccount, setConnectedAccount] = useState(null);
  
  // Token state
  const [tokenData, setTokenData] = useState(null);
  
  // UI state
  const [tokenLoading, setTokenLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate a new UUID when the component mounts
  useEffect(() => {
    setExternalUserId(generateUUID());
  }, []);

  // Get server code snippet
  const getServerCodeSnippet = () => `import { createBackendClient } from "@pipedream/sdk/server";
 
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

  // Get client code snippet
  const getClientCodeSnippet = () => `import { createFrontendClient } from "@pipedream/sdk/browser"
 
// This code runs in the browser
const pd = createFrontendClient()

// Connect an account using the token from your server
pd.connectAccount({
  app: "${appSlug}", 
  token: "${tokenData?.token ? tokenData.token.substring(0, 10) + "..." : "YOUR_TOKEN"}", 
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

  // Generate token async function
  async function generateToken() {
    setTokenLoading(true);
    setError(null);
    
    try {
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

  // Connect account function
  function connectAccount() {
    if (!tokenData?.token) {
      setError("Please generate a token first");
      return;
    }

    setError(null);

    try {
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

  // Create value object
  const value = {
    // State
    appSlug,
    externalUserId,
    tokenData,
    connectedAccount,
    error,
    tokenLoading,
    
    // Actions
    setAppSlug,
    generateToken,
    connectAccount,
    
    // Code snippets
    getServerCodeSnippet,
    getClientCodeSnippet,
  };

  return (
    <ConnectDemoContext.Provider value={value}>
      {children}
    </ConnectDemoContext.Provider>
  );
}

// Custom hook for using the context
export function useConnectDemo() {
  const context = useContext(ConnectDemoContext);
  if (!context) {
    throw new Error('useConnectDemo must be used within a ConnectDemoProvider');
  }
  return context;
}