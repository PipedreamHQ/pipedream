import { z } from "zod"
import { V1Component } from "@pipedream/sdk"
import { ToolConfigState } from "./types"
import { wrapTool } from "./wrapper"
import { ToolConfigStateMachine } from "./toolConfigStateMachine"

export const CONFIGURE_PROPS_TOOL_NAME = "CFG"

type ConfigurePropsToolDef = {
  machine: ToolConfigStateMachine
  component: V1Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any>
}

export const configurePropsToolTool = ({
  machine,
  component,
  schema,
}: ConfigurePropsToolDef) => {
  const toolName = `${CONFIGURE_PROPS_TOOL_NAME}_${component.key.toUpperCase()}_PROPS`

  return wrapTool(
    {
      name: toolName,
      description: component.description ?? "No description available",
      inputSchema: z.object(schema),
      isActive: (stage: ToolConfigState["stage"]) =>
        stage === "CONFIGURING_TOOL",
      callback: async (args, _extra, machine) => {
        if (machine.state.stage !== "CONFIGURING_TOOL") {
          throw new Error("Not in configuration mode")
        }

        machine.state.configuredProps = {
          ...machine.state.configuredProps,
          ...args,
        }

        const nextPropNames = (await machine.getNextPropsToShow()).map(
          (prop) => prop.name,
        )

        // Now update shownProps with the properties that were just configured
        machine.state.shownProps = [
          ...machine.state.shownProps,
          ...nextPropNames,
        ]

        await machine.reloadProps()

        const remainingRequiredProps = await machine.getRequiredProps()
        const unconfiguredProps = await machine.getUnconfiguredProps()

        let responseMessage: string

        if (nextPropNames.length === 0) {
          machine.state = {
            ...machine.state,
            stage: "TOOL_CONFIGURATION_COMPLETED",
          }

          responseMessage = `Configuration completed. You have completed all required configuration. Call the RUN_${component.key.toUpperCase()} tool to run the action with configured properties.`
        } else if (!remainingRequiredProps.length && unconfiguredProps.length) {
          responseMessage = `Configuration completed. You have completed all required configuration. Call the RUN_${component.key.toUpperCase()} tool to run the action with configured properties. The following properties are still optional and can still be configured: ${unconfiguredProps.map((cp) => cp.name).join(", ")}.`
        } else {
          responseMessage = `Please call this tool again to configure ${nextPropNames.map((prop) => prop).join(", ")}.`
        }

        return {
          content: [
            {
              type: "text",
              text: responseMessage,
              hashid: await machine.getCurrentComponentAppHashid(),
            },
          ],
        }
      },
    },
    machine,
  )
}
