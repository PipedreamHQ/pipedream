import { DynamicToolMcpServer } from "./lib/dynamicToolMcpServer"
import { ToolConfigStateMachine } from "./lib/tools/toolConfigStateMachine"

export const statefulMcpServerFactory = async ({ uuid }: { uuid: string }) => {
  const stateMachine = new ToolConfigStateMachine(uuid)

  const server = new DynamicToolMcpServer(
    {
      name: "pd-connect",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {
          listChanged: true,
        },
      },
      getToolsFn: stateMachine.getTools.bind(stateMachine),
    }
  )

  return server.server
}
