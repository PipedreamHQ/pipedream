import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { registerComponentTools } from "../lib/registerComponentTools.js"

export const serverFactory = async ({
  app,
  externalUserId,
}: {
  app: string
  externalUserId: string
}) => {
  const server = new McpServer({
    name: "pipedream-connect",
    version: "1.0.0",
  })

  await registerComponentTools({
    server,
    app,
    externalUserId,
  })

  return server
}
