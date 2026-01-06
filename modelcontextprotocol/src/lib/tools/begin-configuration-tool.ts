import { z } from "zod"
import { V1Component } from "@pipedream/sdk"
import { ToolConfigState } from "./types"
import { wrapTool } from "./wrapper"
import { ToolConfigStateMachine } from "./toolConfigStateMachine"

export const BEGIN_CONFIGURATION_TOOL_NAME = "BEGIN"

type BeginConfigurationToolDef = {
  machine: ToolConfigStateMachine
  component: V1Component
}

export const beginConfigurationTool = ({
  machine,
  component,
}: BeginConfigurationToolDef) => {
  const toolName = `${BEGIN_CONFIGURATION_TOOL_NAME}_${component.key.toUpperCase()}`

  return wrapTool(
    {
      name: toolName,
      description: component.description ?? "No description available",
      inputSchema: z.object({}),
      isActive: (stage: ToolConfigState["stage"]) => stage === "APPS_SELECTED",
      callback: async () => {
        machine.state = {
          ...machine.state,
          stage: "CONFIGURING_TOOL",
          currentComponentKey: component.key,
          configuredProps: {},
          shownProps: [],
        }

        return {
          content: [
            {
              type: "text",
              text: `
You are now in configuration mode. Please use CFG_${component.key.toUpperCase()}_PROPS to configure the tool.
Unless you need to ask the user for more information, you should keep configuring the tool. Once you are done configuring it,
you will be given a new tool to run the action with configured properties.
Again, unless you need to ask the user for more information, just run the tool.
              `,
              hashid: await machine.getCurrentComponentAppHashid(),
            },
          ],
        }
      },
    },
    machine,
  )
}
