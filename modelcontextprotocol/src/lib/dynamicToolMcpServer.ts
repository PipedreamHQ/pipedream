import {
  Server,
  ServerOptions,
} from "@modelcontextprotocol/sdk/server/index.js"
import { RegisteredTool } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  CallToolRequestSchema,
  ErrorCode,
  Implementation,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js"
import { zodToJsonSchema } from "zod-to-json-schema"

type GetToolsFn = () => Promise<Record<string, RegisteredTool>>

export class DynamicToolMcpServer {
  server: Server
  private getTools: GetToolsFn

  constructor(
    serverInfo: Implementation,
    options: ServerOptions & { getToolsFn: GetToolsFn }
  ) {
    this.server = new Server(serverInfo, options)
    this.getTools = options.getToolsFn
    this.setHandlers()
  }

  private setHandlers() {
    this.server.assertCanSetRequestHandler(
      ListToolsRequestSchema.shape.method.value
    )
    this.server.assertCanSetRequestHandler(
      CallToolRequestSchema.shape.method.value
    )

    this.server.registerCapabilities({
      tools: {
        listChanged: true,
      },
    })

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = await this.getTools()
      return {
        tools: Object.entries(tools)
          .filter(([, tool]) => tool.enabled !== false)
          .map(([name, tool]) => ({
            name,
            description: tool.description,
            inputSchema: tool.inputSchema
              ? zodToJsonSchema(tool.inputSchema, { strictUnions: true })
              : { type: "object" },
          })),
      }
    })

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request, extra) => {
        const tools = await this.getTools()
        const tool = tools[request.params.name]

        console.log(">> Tool", request.params.name, request.params.arguments)

        if (!tool) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Tool ${request.params.name} not found`
          )
        }

        if (tool.enabled === false) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Tool ${request.params.name} is disabled`
          )
        }

        const args = request.params.arguments

        try {
          if (tool.inputSchema) {
            const parseResult = await tool.inputSchema.safeParseAsync(args)
            if (!parseResult.success) {
              throw new McpError(
                ErrorCode.InvalidParams,
                `Invalid arguments: ${parseResult.error.message}`
              )
            }
            return await tool.callback(parseResult.data, extra)
          }
          return await tool.callback(extra)
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `An error occurred while calling the tool: ${error}`, // XXX Do we need to sanitize this?
              },
            ],
          }
        }
      }
    )
  }
}
