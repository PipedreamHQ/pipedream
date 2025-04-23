"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";

export default function DemoExternalUserID() {
  const { externalUserId } = useGlobalConnect();
  
  return (
    <code className="px-2 py-1 bg-gray-100 rounded text-sm">{externalUserId}</code>
  );
}