import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js"
import {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js"
import { z, ZodType } from "zod"
import { type ToolConfigStateMachine } from "./toolConfigStateMachine"
import { Stage } from "./types"

export type ToolCallback<Schema extends ZodType = ZodType> = (
  args: z.infer<Schema>,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  machine: ToolConfigStateMachine
) => CallToolResult | Promise<CallToolResult>

export type ToolDefinition = {
  name: string
  description: string
  inputSchema: ZodType
  callback: ToolCallback<ZodType>
  isActive(stage: Stage): boolean
}

export const wrapTool = (
  toolDef: ToolDefinition,
  machine: ToolConfigStateMachine
) => {
  const { isActive, name, callback, description, inputSchema, ...rest } =
    toolDef

  return {
    name,
    tool: {
      ...rest,
      description,
      inputSchema,
      callback: (
        args: unknown = z.object({}),
        extra: RequestHandlerExtra<ServerRequest, ServerNotification>
      ) => {
        return callback(args, extra, machine)
      },
    },
    isActive: (stage: Stage) => isActive(stage),
  }
}

export type WrappedTool = ReturnType<typeof wrapTool>
