"use client";

import {
  createContext, useContext, useState, useEffect,
} from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";
import {
  getServerCodeSnippet, getClientCodeSnippet,
} from "./ConnectCodeSnippets";

// Generate a UUID v4 for use as external_user_id
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x"
      ? r
      : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Create the context
const GlobalConnectContext = createContext(null);

// Provider component
export function GlobalConnectProvider({ children }) {
  // User and account state
  const [
    appSlug,
    setAppSlug,
  ] = useState("slack");
  const [
    externalUserId,
    setExternalUserId,
  ] = useState("");
  const [
    connectedAccount,
    setConnectedAccount,
  ] = useState(null);

  // Token state
  const [
    tokenData,
    setTokenData,
  ] = useState(null);

  // UI state
  const [
    tokenLoading,
    setTokenLoading,
  ] = useState(false);
  const [
    error,
    setError,
  ] = useState(null);

  // Generate a new UUID when the component mounts
  useEffect(() => {
    setExternalUserId(generateUUID());
  }, []);

  // Get server code snippet wrapper function
  const getServerSnippet = () => getServerCodeSnippet(externalUserId);

  // Get client code snippet wrapper function
  const getClientSnippet = () => getClientCodeSnippet(appSlug, tokenData);

  // Generate token async function
  async function generateToken() {
    setTokenLoading(true);
    setError(null);
    // Clear any previously connected account when generating a new token
    setConnectedAccount(null);

    try {
      const response = await fetch("/docs/api-demo-connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          external_user_id: externalUserId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get token");
      }

      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setTokenLoading(false);
    }
  }

  // Fetch account details from API
  async function fetchAccountDetails(accountId) {
    try {
      // Use the same token credentials to fetch account details
      const response = await fetch(`/docs/api-demo-connect/accounts/${accountId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Failed to fetch account details", await response.text());
        return {
          id: accountId,
        }; // Fall back to just the ID
      }

      const data = await response.json();
      return data; // Return the full account details
    } catch (err) {
      console.warn("Error fetching account details:", err);
      return {
        id: accountId,
      }; // Fall back to just the ID
    }
  }

  // Connect account function
  function connectAccount() {
    if (!tokenData?.token) {
      setError("Please generate a token first");
      return;
    }

    setError(null);

    try {
      const pd = createFrontendClient();
      pd.connectAccount({
        app: appSlug,
        token: tokenData.token,
        onSuccess: async (account) => {
          // Initialize with just the ID
          setConnectedAccount({
            id: account.id,
            loading: true,
          });

          // Fetch additional account details
          const accountDetails = await fetchAccountDetails(account.id);

          // Update with the full details
          setConnectedAccount({
            ...accountDetails,
            loading: false,
          });

          // Token is single-use, so clear it after successful connection
          setTokenData(null);
        },
        onError: (err) => {
          setError(err.message || "Failed to connect account, please refresh the page and try again.");
        },
        onClose: () => {
          // Dialog closed by user - no action needed
        },
      });
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  }

  // Create value object
  const value = {
    // State
    appSlug,
    externalUserId,
    tokenData,
    connectedAccount,
    error,
    tokenLoading,

    // Actions
    setAppSlug,
    generateToken,
    connectAccount,

    // Code snippets
    getServerCodeSnippet: getServerSnippet,
    getClientCodeSnippet: getClientSnippet,
  };

  return (
    <GlobalConnectContext.Provider value={value}>
      {children}
    </GlobalConnectContext.Provider>
  );
}

// Custom hook for using the context
export function useGlobalConnect() {
  const context = useContext(GlobalConnectContext);
  if (!context) {
    throw new Error("useGlobalConnect must be used within a GlobalConnectProvider");
  }
  return context;
}
