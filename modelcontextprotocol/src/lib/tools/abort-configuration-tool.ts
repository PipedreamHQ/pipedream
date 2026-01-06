import { z } from "zod"
import { V1Component } from "@pipedream/sdk"
import { ToolConfigState } from "./types"
import { wrapTool } from "./wrapper"
import { ToolConfigStateMachine } from "./toolConfigStateMachine"

export const ABORT_CONFIGURATION_TOOL_NAME = "ABORT"

type AbortConfigurationToolDef = {
  machine: ToolConfigStateMachine
  component: V1Component
}

export const abortConfigurationTool = ({
  machine,
  component,
}: AbortConfigurationToolDef) => {
  const toolName = `${ABORT_CONFIGURATION_TOOL_NAME}_${component.key.toUpperCase()}`

  return wrapTool(
    {
      name: toolName,
      description: "Abort the configuration process",
      inputSchema: z.object({}),
      isActive: (stage: ToolConfigState["stage"]) =>
        stage === "CONFIGURING_TOOL",
      callback: async () => {
        const appHashid = await machine.getCurrentComponentAppHashid()
        machine.state = {
          stage: "APPS_SELECTED",
          availableApps: machine.state.availableApps ?? [],
          selectedApps: machine.state.selectedApps ?? [],
        }

        return {
          content: [
            {
              type: "text",
              text: "Configuration process aborted.",
              hashid: appHashid,
            },
          ],
        }
      },
    },
    machine,
  )
}
