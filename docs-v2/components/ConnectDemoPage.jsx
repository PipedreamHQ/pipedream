"use client";

import { useState, useEffect } from "react";
import InlineConnectDemo, { 
  ExternalUserID,
  GenerateTokenButton,
  TokenResponse,
  AppSelector,
  ConnectAccountButton,
  ConnectionStatus
} from "./InlineConnectDemo";
import CodeBlock from "./CodeBlock";

export default function ConnectDemoPage() {
  const [demo, setDemo] = useState(null);
  
  useEffect(() => {
    // Initialize the demo on the client side
    setDemo(InlineConnectDemo());
  }, []);
  
  if (!demo) {
    return <div>Loading demo...</div>;
  }
  
  return (
    <div className="space-y-8">
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
          Step 1: Generate a Connect Token (Server-side)
        </div>
        <div className="p-4">
          <div className="mb-3">
            <div className="flex items-center mb-4">
              <span className="font-medium text-sm">External User ID:</span>
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{demo.externalUserId}</code>
            </div>
            
            <div className="mb-4">
              <div className="text-sm mb-2">Server-side code running in the API route:</div>
              <CodeBlock code={demo.serverCodeSnippet} language="javascript" />
            </div>
          </div>

          <div className="mt-4 mb-2">
            <GenerateTokenButton 
              onGenerate={demo.generateToken}
              loading={demo.tokenLoading}
            />
          </div>

          <TokenResponse data={demo.tokenData} />
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
              <div className="ml-2">
                <AppSelector 
                  value={demo.appSlug}
                  onChange={(e) => demo.setAppSlug(e.target.value)}
                  disabled={!demo.tokenData}
                />
              </div>
            </label>
            
            <div className="mb-4">
              <div className="text-sm mb-2">Client-side code executed in the browser:</div>
              <CodeBlock code={demo.clientCodeSnippet} language="javascript" />
            </div>
          </div>

          <div className="mt-4 mb-2">
            <ConnectAccountButton 
              onClick={demo.connectAccount}
              disabled={!demo.tokenData}
            />
          </div>

          <ConnectionStatus 
            account={demo.connectedAccount}
            error={demo.error}
          />
        </div>
      </div>
      
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