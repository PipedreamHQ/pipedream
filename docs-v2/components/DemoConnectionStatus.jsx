"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";

export default function DemoConnectionStatus() {
  const { connectedAccount, error } = useGlobalConnect();
  
  return (
    <>
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
    </>
  );
}