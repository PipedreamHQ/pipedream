"use client";

import { useState, useEffect } from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";
import CodeBlock from "./CodeBlock";

// Generate a UUID v4 for use as external_user_id
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function ExternalUserID() {
  const [userId, setUserId] = useState("");
  
  useEffect(() => {
    setUserId(generateUUID());
  }, []);
  
  return (
    <code className="px-2 py-1 bg-gray-100 rounded text-sm">{userId}</code>
  );
}

export function GenerateTokenButton({ onGenerate, loading }) {
  return (
    <button
      onClick={onGenerate}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm"
    >
      {loading ? "Generating..." : "Generate Token"}
    </button>
  );
}

export function TokenResponse({ data }) {
  if (!data) return null;
  
  return (
    <div className="mt-4">
      <div className="text-sm mb-2">Server Response:</div>
      <CodeBlock 
        code={JSON.stringify(data, null, 2)} 
        language="json" 
        className="max-h-48 overflow-auto" 
      />
    </div>
  );
}

export function ConnectAccountButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm"
    >
      Connect Account
    </button>
  );
}

export function ConnectionStatus({ account, error }) {
  if (error) {
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
        <div className="font-medium text-sm">Error</div>
        <div className="mt-1 text-sm">{error}</div>
      </div>
    );
  }
  
  if (!account) return null;
  
  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
      <div className="font-medium text-sm">Account successfully connected!</div>
      <div className="mt-1 text-sm">
        {account.name && (
          <div>Account name: <span className="font-medium">{account.name}</span></div>
        )}
        {account.id && (
          <div>Account ID: <span className="font-mono text-xs">{account.id}</span></div>
        )}
      </div>
    </div>
  );
}

export function AppSelector({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="p-1 border rounded text-sm"
      disabled={disabled}
    >
      <option value="slack">Slack</option>
      <option value="github">GitHub</option>
      <option value="google_sheets">Google Sheets</option>
    </select>
  );
}

export default function InlineConnectDemo() {
  // State
  const [externalUserId, setExternalUserId] = useState("");
  const [appSlug, setAppSlug] = useState("slack");
  const [tokenData, setTokenData] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate a new UUID when the component mounts
  useEffect(() => {
    setExternalUserId(generateUUID());
  }, []);

  // Server-side code snippet with current external user ID
  const serverCodeSnippet = `import { createBackendClient } from "@pipedream/sdk/server";
 
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
  external_user_id: "${externalUserId}", 
});`;

  // Client-side code snippet with current app and token
  const clientCodeSnippet = `import { createFrontendClient } from "@pipedream/sdk/browser"
 
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

  return {
    // State
    externalUserId,
    tokenData,
    appSlug,
    connectedAccount,
    error,
    tokenLoading,
    
    // Code snippets
    serverCodeSnippet,
    clientCodeSnippet,
    
    // Actions
    generateToken,
    connectAccount,
    setAppSlug,
  };
}