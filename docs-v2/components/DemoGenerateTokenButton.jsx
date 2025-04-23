"use client";

import { useConnectDemo } from './ConnectDemoContext';

export default function DemoGenerateTokenButton() {
  const { generateToken, tokenLoading } = useConnectDemo();
  
  return (
    <button
      onClick={generateToken}
      disabled={tokenLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm"
    >
      {tokenLoading ? "Generating..." : "Generate Token"}
    </button>
  );
}