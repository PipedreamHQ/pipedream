import { z } from "zod"
import { RunActionOpts, V1Component } from "@pipedream/sdk"
import { ToolConfigState } from "./types"
import { wrapTool } from "./wrapper"
import { ToolConfigStateMachine } from "./toolConfigStateMachine"
import { componentMapper } from "../componentMapper"
import { componentAppName } from "../utils"
import { getAuthProvision } from "../authProvisions"
import { pd } from "../../pd-client"

type RunActionToolDef = {
  machine: ToolConfigStateMachine
  component: V1Component
}

export const runActionTool = async ({
  machine,
  component,
}: RunActionToolDef) => {
  const {
    description,
    schema: fullSchema,
    appKey,
  } = componentMapper(component, true)

  if (!appKey) {
    throw new Error("App key not found")
  }

  return wrapTool(
    {
      name: component.key.toUpperCase(),
      description,
      inputSchema: z.object(fullSchema),
      isActive: (stage: ToolConfigState["stage"]) => stage === "APPS_SELECTED",
      callback: async (_args) => {
        console.log(">> tool_callback", _args)
        const appName = componentAppName(component)

        if (!appName) {
          throw new Error("App name not found")
        }

        const args = z.object(fullSchema).parse(_args)
        const authProvisionResponse = await getAuthProvision({
          app: appName,
          uuid: machine.uuid,
        })

        const appHashid = machine.appSlugToHashid[appName]

        if (typeof authProvisionResponse === "string") {
          return {
            content: [
              {
                type: "text",
                text: authProvisionResponse,
                hashid: appHashid,
              },
            ],
          }
        }

        const requestOpts: RunActionOpts = {
          actionId: {
            key: component.key,
          },
          configuredProps: {
            ...args,
            [appKey]: {
              authProvisionId: authProvisionResponse.id,
            },
          },
          externalUserId: machine.uuid,
        }
        const response = await pd.runAction(requestOpts)
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
