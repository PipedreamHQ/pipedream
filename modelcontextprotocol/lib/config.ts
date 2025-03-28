/**
 * Configuration for the MCP Reference Implementation
 * You can override these settings using environment variables
 */

interface PipedreamConfig {
  clientId: string | undefined
  clientSecret: string | undefined
  projectId: string | undefined
  environment: string | undefined
  webhookUri: string | undefined
}

interface Config {
  defaultApp: string
  serverPort: number
  pipedream: PipedreamConfig
}

export const config: Config = {
  // Default app to use if none is specified
  defaultApp: process.env.APP || "slack",

  // Port for the SSE server
  serverPort: process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3010,

  // Pipedream configuration
  pipedream: {
    // Your Pipedream OAuth client credentials
    clientId: process.env.PIPEDREAM_CLIENT_ID,
    clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,

    // Your Pipedream project ID
    projectId: process.env.PIPEDREAM_PROJECT_ID,

    // Pipedream project environment
    environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || "development",

    // Webhook URI for OAuth callbacks
    webhookUri: process.env.PIPEDREAM_WEBHOOK_URI,
  },
}
