import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { serverFactory } from "./mcp-server.js"
import { randomUUID } from "crypto"
import { fileURLToPath } from "url"

export async function main(appName: string, externalUserId?: string) {
  if (!appName) {
    throw new Error("App name is required for stdio server")
  }

  const transport = new StdioServerTransport()

  // Use provided external user ID or generate a random UUID
  const userId = externalUserId || randomUUID()

  const server = await serverFactory({
    // The app slug (app ID) — https://pipedream.com/docs/rest-api/#list-apps
    app: appName,
    // This is your user's ID, in your system — whatever you use to uniquely identify them.
    // See https://pipedream.com/docs/connect/api/#external-users
    externalUserId: userId,
  })
  await server.connect(transport)
  console.error(
    `pd-connect MCP Server running on stdio for app: ${appName}, external_user_id: ${userId}`,
  )
}

// Check if this file is being run directly
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)

if (isMainModule) {
  // When run directly, require APP env var
  const appName = process.env.APP
  if (!appName) {
    console.error("Error: APP environment variable is required")
    process.exit(1)
  }

  main(appName).catch((error) => {
    console.error("Fatal error in main():", error)
    process.exit(1)
  })
}
