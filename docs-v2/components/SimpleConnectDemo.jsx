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

export default function SimpleConnectDemo() {
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
  external_user_id: "${externalUserId || "YOUR_USER_ID"}", 
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
      const response = await fetch('/docs/api-demo-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_user_id: externalUserId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get token');
      }
      
      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setTokenLoading(false);
    }
  }

  function connectAccount() {
    if (!tokenData?.token) {
      setError('Please generate a token first');
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
          setError(err.message || 'Failed to connect account');
        },
        onClose: () => {
          // Dialog closed by user - no action needed
        },
      });
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  }

  return (
    <div className="space-y-8 not-prose">
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
          Step 1: Generate a Connect Token (Server-side)
        </div>
        <div className="p-4">
          <div className="mb-3">
            <div className="flex items-center mb-4">
              <span className="font-medium text-sm">External User ID:</span>
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{externalUserId}</code>
            </div>
            
            <div className="mb-4">
              <div className="text-sm mb-2">Server-side code running in the API route:</div>
              <CodeBlock code={serverCodeSnippet} language="javascript" />
            </div>
          </div>

          <div className="mt-4 mb-2">
            <button
              onClick={generateToken}
              disabled={tokenLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm"
            >
              {tokenLoading ? "Generating..." : "Generate Token"}
            </button>
          </div>

          {tokenData && (
            <div className="mt-4">
              <div className="text-sm mb-2">Server Response:</div>
              <CodeBlock 
                code={JSON.stringify(tokenData, null, 2)} 
                language="json" 
                className="max-h-48 overflow-auto" 
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
          Step 2: Connect an Account (Client-side)
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="flex items-center mb-4">
              <span className="font-medium text-sm">App to connect:</span>
              <select
                value={appSlug}
                onChange={(e) => setAppSlug(e.target.value)}
                className="ml-2 p-1 border rounded text-sm"
                disabled={!tokenData}
              >
                <option value="slack">Slack</option>
                <option value="github">GitHub</option>
                <option value="google_sheets">Google Sheets</option>
              </select>
            </label>
            
            <div className="mb-4">
              <div className="text-sm mb-2">Client-side code executed in the browser:</div>
              <CodeBlock code={clientCodeSnippet} language="javascript" />
            </div>
          </div>

          <div className="mt-4 mb-2">
            <button
              onClick={connectAccount}
              disabled={!tokenData}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm"
            >
              Connect Account
            </button>
          </div>

          {connectedAccount && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
              <div className="font-medium text-sm">Account successfully connected!</div>
              <div className="mt-1 text-sm">
                {connectedAccount.name && (
                  <div>Account name: <span className="font-medium">{connectedAccount.name}</span></div>
                )}
                {connectedAccount.id && (
                  <div>Account ID: <span className="font-mono text-xs">{connectedAccount.id}</span></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          <div className="font-medium text-sm">Error</div>
          <div className="mt-1 text-sm">{error}</div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600 border-t pt-4">
        <p className="text-sm">This demo showcases the recommended implementation flow:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
          <li>Securely generate a token on your server (keeping credentials private)</li>
          <li>Pass the token to your frontend to connect an account</li>
        </ol>
        <p className="mt-2 text-sm opacity-80">Note: Each time you reload this page, a new unique user ID is generated.</p>
      </div>
    </div>
  );
}