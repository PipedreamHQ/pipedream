"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import CodeBlock from "./CodeBlock";

export default function DemoTokenResponse() {
  const { tokenData } = useGlobalConnect();
  
  if (!tokenData) return null;
  
  return (
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
  );
}