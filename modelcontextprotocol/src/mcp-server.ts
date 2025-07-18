import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { registerComponentTools } from "./lib/registerComponentTools"

export const serverFactory = async ({
  app,
  uuid,
}: {
  app: string
  uuid: string
}) => {
  const server = new McpServer({
    name: "pd-connect",
    version: "1.0.0",
  })

  await registerComponentTools({
    server,
    app,
    uuid,
  })

  return server
}
