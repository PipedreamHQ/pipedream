"use client";

import { useGlobalConnect } from "./GlobalConnectProvider";

export default function DemoAppSelector() {
  const { appSlug, setAppSlug, tokenData } = useGlobalConnect();
  
  return (
    <select
      value={appSlug}
      onChange={(e) => setAppSlug(e.target.value)}
      className="p-1 border rounded text-sm"
      disabled={!tokenData}
    >
      <option value="slack">Slack</option>
      <option value="github">GitHub</option>
      <option value="google_sheets">Google Sheets</option>
    </select>
  );
}