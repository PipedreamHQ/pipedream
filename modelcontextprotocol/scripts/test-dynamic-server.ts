import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js"

async function main() {
  const transport = new SSEClientTransport(new URL("http://localhost:3010/123"))

  const client = new Client({
    name: "example-pd-client",
    version: "1.0.0",
  })

  await client.connect(transport)

  const tools = await client.listTools()
  console.log(
    `TOOLS: ${JSON.stringify(tools.tools.map((tool) => tool.name).join(", "))}`
  )

  // Call a tool
  const query = "Send new GitHub issues to Slack"
  console.log(`Calling WHAT_ARE_YOU_TRYING_TO_DO tool with query: ${query}`)
  const whatAreYouDoingResult = await client.callTool({
    name: "WHAT_ARE_YOU_TRYING_TO_DO",
    arguments: {
      query,
    },
  })

  console.log(`RESULT: ${JSON.stringify(whatAreYouDoingResult, null, 2)}`)

  const newTools = await client.listTools()
  console.log(
    `NEW TOOLS: ${JSON.stringify(newTools.tools.map((tool) => tool.name).join(", "))}`
  )

  const apps = ["github", "slack"]
  console.log(`Calling SELECT_APPS tool with apps: ${apps.join(", ")}`)
  const selectAppsResult = await client.callTool({
    name: "SELECT_APPS",
    arguments: {
      apps,
    },
  })

  console.log(`RESULT: ${JSON.stringify(selectAppsResult, null, 2)}`)

  const newTools2 = await client.listTools()
  console.log(
    `NEW TOOLS: ${JSON.stringify(newTools2.tools.map((tool) => tool.name).join(", "))}`
  )
}

main().catch(console.error)
