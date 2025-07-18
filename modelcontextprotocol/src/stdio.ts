import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { serverFactory } from "./mcp-server"

async function main() {
  const transport = new StdioServerTransport()
  const server = await serverFactory({
    app: "slack",
    uuid: "stdio-3riwij3oijw4eiofjw3i",
  })
  await server.connect(transport)
  console.error("pd-connect MCP Server running on stdio")
}

main().catch((error) => {
  console.error("Fatal error in main():", error)
  process.exit(1)
})
