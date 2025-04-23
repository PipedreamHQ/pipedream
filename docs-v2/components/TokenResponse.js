"use client";

import { useConnectSDK } from "./ConnectSDKContext";
import CodeBlock from "./CodeBlock";

export default function TokenResponse() {
  const {
    tokenData, codeSnippets,
  } = useConnectSDK();

  if (!tokenData) return null;

  return (
    <div className="mt-4">
      <div className="text-sm mb-2">Server Response:</div>
      <CodeBlock
        code={codeSnippets.tokenResponse}
        language="json"
        className="max-h-48 overflow-auto"
      />
    </div>
  );
}
