"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import CodeBlock from "./CodeBlock";

export default function TokenGenerationDemo() {
  const { 
    externalUserId, 
    getServerCodeSnippet, 
    generateToken, 
    tokenLoading,
    tokenData 
  } = useGlobalConnect();

  return (
    <div className="border rounded-md overflow-hidden mt-4">
      <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
        Generate a Connect Token from your server
      </div>
      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center mb-4">
            <span className="font-medium text-sm">External User ID:</span>
            <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">{externalUserId}</code>
          </div>
          <div className="mb-4">
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <CodeBlock code={getServerCodeSnippet()} language="javascript" />
            </div>
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
            <div className="text-sm mb-2 font-medium">Server Response:</div>
            <div className="border border-green-200 rounded-lg overflow-hidden">
              <CodeBlock 
                code={JSON.stringify(tokenData, null, 2)} 
                language="json" 
                className="max-h-48 overflow-auto" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}