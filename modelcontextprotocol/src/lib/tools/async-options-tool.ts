import { z } from "zod"
import {
  ConfigurableProp,
  V1Component,
} from "@pipedream/sdk"
import { ToolConfigState } from "./types"
import { wrapTool } from "./wrapper"
import { ToolConfigStateMachine } from "./toolConfigStateMachine"
import { componentMapper } from "../componentMapper"
import { componentAppName } from "../utils"
import { getAuthProvision } from "../authProvisions"
import { pd } from "../../pd-client"

export const ASYNC_OPTIONS_TOOL_NAME = "OPTS"

type AsyncOptionsToolDef = {
  machine: ToolConfigStateMachine
  component: V1Component
  option: ConfigurableProp
}

export const asyncOptionsTool = ({
  machine,
  component,
  option,
}: AsyncOptionsToolDef) => {
  const toolName = `${ASYNC_OPTIONS_TOOL_NAME}_${component.key.toUpperCase()}_${option.name.toUpperCase()}`

  return wrapTool(
    {
      name: toolName,
      description: `Fetch options for ${option.name}`,
      inputSchema: z.object({}),
      isActive: (stage: ToolConfigState["stage"]) =>
        stage === "CONFIGURING_TOOL",
      callback: async () => {
        const { appKey } = componentMapper(component)
        if (!appKey) {
          throw new Error("App key not found")
        }

        const app = componentAppName(component)
        if (!app) {
          throw new Error("App not found")
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

        const response = await pd.configureComponent({
          componentId: {
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
          propName: option.name,
        })

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
              hashid: await machine.getCurrentComponentAppHashid(),
            },
          ],
        }
      },
    },
    machine,
  )
}
