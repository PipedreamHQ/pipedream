"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";
import DemoAppSelector from "./DemoAppSelector";
import DemoClientCode from "./DemoClientCode";
import DemoConnectButton from "./DemoConnectButton";
import DemoConnectionStatus from "./DemoConnectionStatus";

export default function AccountConnectionDemo() {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 border-b px-4 py-2 font-medium text-sm">
        Step 2: Connect an Account (Client-side)
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label className="flex items-center mb-4">
            <span className="font-medium text-sm">App to connect:</span>
            <span className="ml-2"><DemoAppSelector /></span>
          </label>
          
          <div className="mb-4">
            <div className="text-sm mb-2 font-medium">Client-side code executed in the browser:</div>
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <DemoClientCode />
            </div>
          </div>
        </div>

        <div className="mt-4 mb-2">
          <DemoConnectButton />
        </div>

        <DemoConnectionStatus />
      </div>
    </div>
  );
}