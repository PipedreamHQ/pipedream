"use client";

import { useConnectDemo } from "./ConnectDemoContext";

export default function DemoExternalUserID() {
  const { externalUserId } = useConnectDemo();
  
  return (
    <code className="px-2 py-1 bg-gray-100 rounded text-sm">{externalUserId}</code>
  );
}