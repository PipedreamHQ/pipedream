"use client";

import { ConnectDemoProvider } from "./ConnectDemoContext";

export default function ConnectDemo({ children }) {
  return (
    <ConnectDemoProvider>
      <div className="not-prose">
        {children}
      </div>
    </ConnectDemoProvider>
  );
}