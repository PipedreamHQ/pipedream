import { z } from "zod"
import { V1Component } from "@pipedream/sdk"
import { ToolConfigState } from "./types"
import { wrapTool } from "./wrapper"
import { ToolConfigStateMachine } from "./toolConfigStateMachine"
import { componentMapper } from "../componentMapper"
import { componentAppName } from "../utils"
import { getAuthProvision } from "../authProvisions"
import { pd } from "../../pd-client"

export const RUN_TOOL_NAME = "RUN"

type RunToolDef = {
  machine: ToolConfigStateMachine
  component: V1Component
}

export const runTool = ({ machine, component }: RunToolDef) => {
  const toolName = `${RUN_TOOL_NAME}_${component.key.toUpperCase()}`

  return wrapTool(
    {
      name: toolName,
      description: "Execute using configured properties",
      inputSchema: z.object({}),
      isActive: (stage: ToolConfigState["stage"]) =>
        stage === "TOOL_CONFIGURATION_COMPLETED",
      callback: async () => {
        const app = componentAppName(component)
        if (!app) {
          throw new Error("App not found")
        }

        const { appKey } = componentMapper(component)
        if (!appKey) {
          throw new Error("App key not found")
        }

        const authProvisionResponse = await getAuthProvision({
          app,
          uuid: machine.uuid,
        })

        if (typeof authProvisionResponse === "string") {
          return {
            content: [
              {
                type: "text",
                text: authProvisionResponse,
                hashid: await machine.getCurrentComponentAppHashid(),
              },
            ],
          }
        }

        const response = await pd.runAction({
          actionId: {
            key: component.key,
          },
          dynamicPropsId: machine.state.dynamicPropsId,
          configuredProps: {
            ...machine.state.configuredProps,
            [appKey]: {
              authProvisionId: authProvisionResponse.id,
            },
          },
          externalUserId: machine.uuid,
        })

        const appHashid = await machine.getCurrentComponentAppHashid()
        machine.reset()

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
              hashid: appHashid,
            },
          ],
        }
      },
    },
    machine
  )
}
