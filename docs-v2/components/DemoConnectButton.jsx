"use client";

import { useConnectDemo } from './ConnectDemoContext';

export default function DemoConnectButton() {
  const { connectAccount, tokenData } = useConnectDemo();
  
  return (
    <button
      onClick={connectAccount}
      disabled={!tokenData}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm"
    >
      Connect Account
    </button>
  );
}