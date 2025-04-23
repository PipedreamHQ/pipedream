"use client";

import { ConnectSDKProvider } from "./ConnectSDKContext";

// This component is used as a wrapper in the MDX file
export default function ConnectSDK({ children }) {
  return (
    <ConnectSDKProvider>
      {children}
    </ConnectSDKProvider>
  );
}
