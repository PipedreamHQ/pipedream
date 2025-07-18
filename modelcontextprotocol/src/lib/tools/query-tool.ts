import { z } from "zod"
import { findApps } from "../apps"
import { QUERY_TOOL_NAME } from "../const"
import { QueryToolSchema } from "../schemas"
import { type ToolConfigStateMachine } from "./toolConfigStateMachine"
import { wrapTool, type ToolDefinition } from "./wrapper"

const QuerySchema = z.object(QueryToolSchema)

const queryToolDef: ToolDefinition = {
  name: QUERY_TOOL_NAME,
  isActive: () => true,
  description: `What API or integration are you trying to use? What problem are you trying to solve?

You can tell me multiple parts at the same time and I will return a list of apps that can solve your problem.
`,
  inputSchema: QuerySchema,
  callback: async (args, extra, machine) => {
    const { query } = args

    const { topApps, relevantApps } = await findApps(query)

    // update machine.appSlugToHashid with the new apps
    relevantApps.forEach((app) => {
      machine.appSlugToHashid[app.slug] = app.hid
    })

    machine.state = {
      ...machine.state,
      stage: "AVAILABLE_APPS",
      availableApps: topApps,
    }

    return {
      content: [
        {
          type: "text",
          text: `Based on your query "${query}", I found these relevant apps: ${topApps.join(", ")}. Please select which ones you'd like to use.`,
        },
      ],
    }
  },
}

export const queryTool = (machine: ToolConfigStateMachine) =>
  wrapTool(queryToolDef, machine)
