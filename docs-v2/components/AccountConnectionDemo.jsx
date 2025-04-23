"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import CodeBlock from "./CodeBlock";

export default function AccountConnectionDemo() {
  const { 
    appSlug, 
    setAppSlug, 
    tokenData, 
    getClientCodeSnippet, 
    connectAccount,
    connectedAccount,
    error
  } = useGlobalConnect();

  return (
    <div className="border rounded-md overflow-hidden mt-4">
      <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
        Connect an account from your frontend
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
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <CodeBlock code={getClientCodeSnippet()} language="javascript" />
            </div>
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

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
            <div className="font-medium text-sm">Error</div>
            <div className="mt-1 text-sm">{error}</div>
          </div>
        )}
        
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
  );
}