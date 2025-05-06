import { z } from "zod"
import { SELECT_APPS_TOOL_NAME } from "../const"
import { SelectAppsSchema } from "../schemas"
import { wrapTool, type ToolDefinition } from "./wrapper"
import { type ToolConfigStateMachine } from "./toolConfigStateMachine"
import { pd } from "../../pd-client"

const SelectSchema = z.object(SelectAppsSchema)

const selectAppsToolDef: ToolDefinition = {
  name: SELECT_APPS_TOOL_NAME,
  isActive: (stage) =>
    ["AVAILABLE_APPS", "APPS_SELECTED", "INITIAL"].includes(stage),
  description: "Select the apps you want to use",
  inputSchema: SelectSchema,
  callback: async (_args, _extra, machine) => {
    const args = SelectSchema.parse(_args)
    const { apps: selectedApps } = args

    const invalidApps: string[] = []
    for (const app of selectedApps) {
      const appInfo = await pd.getApp(app)
      if (!appInfo) {
        invalidApps.push(app)
      }
    }

    if (invalidApps.length > 0) {
      return {
        content: [
          {
            type: "text",
            text: `Invalid apps: ${invalidApps.join(", ")}`,
          },
        ],
      }
    }

    machine.state = {
      ...machine.state,
      stage: "APPS_SELECTED",
      selectedApps,
    }

    return {
      content: [
        {
          type: "text",
          text: `Thanks, I've exposed tools for ${selectedApps.join(", ")}.`,
        },
      ],
    }
  },
}

export const selectAppsTool = (machine: ToolConfigStateMachine) =>
  wrapTool(selectAppsToolDef, machine)
