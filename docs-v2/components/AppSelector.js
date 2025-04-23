"use client";

import { useConnectSDK } from "./ConnectSDKContext";

export default function AppSelector() {
  const {
    appOptions, actions, isTokenGenerated,
  } = useConnectSDK();

  return (
    <div className="flex items-center">
      <select
        onChange={(e) => actions.setAppSlug(e.target.value)}
        className="p-1 border rounded text-sm"
        disabled={!isTokenGenerated}
      >
        {appOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
