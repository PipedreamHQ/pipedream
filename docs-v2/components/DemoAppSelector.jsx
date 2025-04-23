"use client";

import { useConnectDemo } from "./ConnectDemoContext";

export default function DemoAppSelector() {
  const { appSlug, setAppSlug, tokenData } = useConnectDemo();
  
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