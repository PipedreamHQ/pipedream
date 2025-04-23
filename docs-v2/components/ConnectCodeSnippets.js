/**
 * This file contains all the code snippets used in the Connect SDK demo.
 * Centralizing them here helps to maintain consistency and makes updates easier.
 */

/**
 * Server-side code for generating a Connect token
 * @param {string} externalUserId - The user's external ID
 * @returns {string} The server code snippet
 */
export function getServerCodeSnippet(externalUserId) {
  return `import { createBackendClient } from "@pipedream/sdk/server";
 
// This code runs on your server
const pd = createBackendClient({
  environment: "development", 
  credentials: {
    clientId: process.env.PIPEDREAM_CLIENT_ID,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
  },
  projectId: process.env.PIPEDREAM_PROJECT_ID
});
 
// Create a token for a specific user
const { token, expires_at, connect_link_url } = await pd.createConnectToken({
  external_user_id: "${externalUserId || "YOUR_USER_ID"}", 
});`;
}

/**
 * Client-side code for connecting an account
 * @param {string} appSlug - The app to connect to (slack, github, etc)
 * @param {object} tokenData - The token data from the server
 * @returns {string} The client code snippet
 */
export function getClientCodeSnippet(appSlug, tokenData) {
  return `import { createFrontendClient } from "@pipedream/sdk/browser"
 
// This code runs in the frontend using the token from your server
export default function Home() {
  function connectAccount() {
  const pd = createFrontendClient()
    pd.connectAccount({
      app: "${appSlug}", 
      token: "${tokenData?.token
    ? tokenData.token.substring(0, 10) + "..."
    : "{connect_token}"}", 
      onSuccess: (account) => {
        // Handle successful connection
        console.log(\`Account successfully connected: \${account.id}\`)
      },
      onError: (err) => {
        // Handle connection error
        console.error(\`Connection error: \${err.message}\`)
      }
    })
  }

  return (
    <main>
      <button onClick={connectAccount}>Connect Account</button>
    </main>
  )
}`;
}
