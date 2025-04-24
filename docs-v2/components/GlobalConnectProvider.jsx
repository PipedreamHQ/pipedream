"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";
import {
  getServerCodeSnippet,
  getClientCodeSnippet,
} from "./ConnectCodeSnippets";
import {
  generateConnectToken,
  fetchAccountDetails,
} from "./api";

/**
 * Generate a UUID v4 for use as external_user_id
 */
function generateUUID() {
  return crypto.randomUUID();
}

// Create the context
const GlobalConnectContext = createContext(null);

/**
 * Provider component for Connect demo state management
 */
export function GlobalConnectProvider({ children }) {
  // User and app state
  const [
    appSlug,
    setAppSlug,
  ] = useState("google_sheets");
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

  // Get code snippet wrapper functions
  const getServerSnippet = () => getServerCodeSnippet(externalUserId);
  const getClientSnippet = () => getClientCodeSnippet(appSlug, tokenData);

  /**
   * Generate a token for the Connect demo
   */
  async function generateToken() {
    setTokenLoading(true);
    setError(null);
    // Clear any previously connected account when generating a new token
    setConnectedAccount(null);

    try {
      const data = await generateConnectToken(externalUserId);
      setTokenData(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setTokenLoading(false);
    }
  }

  /**
   * Connect an account using the Pipedream Connect SDK
   */
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
          // Initialize with just the ID and loading state
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
          setError(err.message || "Failed to connect account");
        },
        onClose: () => {
          // Dialog closed by user - no action needed
        },
      });
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  }

  // Create context value object
  const contextValue = {
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
    <GlobalConnectContext.Provider value={contextValue}>
      {children}
    </GlobalConnectContext.Provider>
  );
}

/**
 * Custom hook for accessing the Connect demo context
 */
export function useGlobalConnect() {
  const context = useContext(GlobalConnectContext);
  if (!context) {
    throw new Error("useGlobalConnect must be used within a GlobalConnectProvider");
  }
  return context;
}
