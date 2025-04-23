"use client";

import { useConnectSDK } from "./ConnectSDKContext";

export default function ExternalUserID() {
  const { externalUserId } = useConnectSDK();

  return (
    <div className="flex items-center">
      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{externalUserId}</code>
    </div>
  );
}
