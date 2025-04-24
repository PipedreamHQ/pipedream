/**
 * API client functions for demo components
 */

/**
 * Generate a request token based on the browser environment
 * Creates a token that matches what the API will generate
 *
 * Note: Server-side uses the origin's hostname for token generation
 * to handle domain mapping in production environments
 */
export function generateRequestToken() {
  if (typeof window === "undefined") return "";

  // Use the same origin's hostname that the server will use when generating the token
  const baseString = `${navigator.userAgent}:${window.location.host}:connect-demo`;
  return btoa(baseString);
}

/**
 * Generate a token for the Connect demo
 * @param {string} externalUserId - The user ID to associate with the token
 * @returns {Promise<Object>} - The token data
 */
export async function generateConnectToken(externalUserId) {
  const requestToken = generateRequestToken();
  const response = await fetch("/docs/api-demo-connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Request-Token": requestToken,
    },
    body: JSON.stringify({
      external_user_id: externalUserId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get token");
  }

  return await response.json();
}

/**
 * Fetch account details from the API
 * @param {string} accountId - The account ID to fetch
 * @returns {Promise<Object>} - The account details
 */
export async function fetchAccountDetails(accountId) {
  const requestToken = generateRequestToken();
  const response = await fetch(`/docs/api-demo-connect/accounts/${accountId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Request-Token": requestToken,
    },
  });

  if (!response.ok) {
    return {
      id: accountId,
    }; // Fall back to just the ID
  }

  return await response.json();
}
