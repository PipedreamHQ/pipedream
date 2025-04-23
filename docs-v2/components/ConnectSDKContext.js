"use client";

import {
  createContext, useContext,
} from "react";
import ConnectSDKDemo from "./ConnectSDKDemo";

// Create a context for the ConnectSDK state
const ConnectSDKContext = createContext(null);

// Provider component that wraps parts of the app that need the state
export function ConnectSDKProvider({ children }) {
  const contextValue = ConnectSDKDemo({});

  return (
    <ConnectSDKContext.Provider value={contextValue}>
      {children}
    </ConnectSDKContext.Provider>
  );
}

// Hook to use the ConnectSDK state
export function useConnectSDK() {
  const context = useContext(ConnectSDKContext);
  if (!context) {
    throw new Error("useConnectSDK must be used within a ConnectSDKProvider");
  }
  return context;
}
