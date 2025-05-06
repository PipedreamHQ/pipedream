import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { ZodRawShape } from "zod"

/**
 * Helper function to safely register a tool, catching "already registered" errors
 */
export const safeRegisterTool = (
  server: McpServer,
  name: string,
  description: string,
  schema: ZodRawShape,
  handler: (args: any) => Promise<any>
) => {
  try {
    server.tool(name, description, schema, handler)
    return { success: true }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("already registered")
    ) {
      return { success: false, reason: "already_registered" }
    }
    throw error // Re-throw any other errors
  }
}
