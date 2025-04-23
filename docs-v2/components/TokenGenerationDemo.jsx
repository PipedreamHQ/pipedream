"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import DemoExternalUserID from "./DemoExternalUserID";
import DemoServerCode from "./DemoServerCode";
import DemoGenerateTokenButton from "./DemoGenerateTokenButton";
import DemoTokenResponse from "./DemoTokenResponse";

export default function TokenGenerationDemo() {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
        Step 1: Generate a Connect Token (Server-side)
      </div>
      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center mb-4">
            <span className="font-medium text-sm">External User ID:</span>
            <span className="ml-2"><DemoExternalUserID /></span>
          </div>
          
          <div className="mb-4">
            <div className="text-sm mb-2 font-medium">Server-side code running in the API route:</div>
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <DemoServerCode />
            </div>
          </div>
        </div>

        <div className="mt-4 mb-2">
          <DemoGenerateTokenButton />
        </div>

        <DemoTokenResponse />
      </div>
    </div>
  );
}