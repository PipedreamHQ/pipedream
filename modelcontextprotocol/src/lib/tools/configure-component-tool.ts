import { z } from "zod"
import { pd } from "../../pd-client"
import { getAuthProvision } from "../authProvisions"
import { componentMapper } from "../componentMapper"
import { CONFIGURE_COMPONENT_TOOL_NAME } from "../const"
import { ConfigureComponentRawSchema } from "../schemas"
import { ToolConfigStateMachine } from "./toolConfigStateMachine"
import { wrapTool } from "./wrapper"
import { componentAppName } from "../utils"

export const configureComponentTool = (machine: ToolConfigStateMachine) => {
  return wrapTool(
    {
      name: CONFIGURE_COMPONENT_TOOL_NAME,
      description: `
    You call this tool if you need to get the available options for a property of a component.
    The property description will tell you if you can use this tool and what the parameter values are.
    `,
      inputSchema: z.object(ConfigureComponentRawSchema),
      isActive: (stage) => stage === "APPS_SELECTED",
      callback: async (_args) => {
        const args = z.object(ConfigureComponentRawSchema).parse(_args)

        const component = await machine.getComponent(
          args.componentKey.toLowerCase() // XXX: Tool names are all uppercase. However, component keys are lowercase. Is it safe to assume we can just cast it to lowercase?
        )

        if (!component) {
          throw new Error("Component not found")
        }

        const app = componentAppName(component)
        if (!app) {
          throw new Error("App not found")
        }

        const authProvisionResponse = await getAuthProvision({
          app,
          uuid: machine.uuid,
        })

        const { appKey } = componentMapper(component)

        if (!appKey) {
          throw new Error("App key not found")
        }

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
          configuredProps: {
            [appKey]: {
              authProvisionId: authProvisionResponse.id,
            },
          },
          externalUserId: machine.uuid,
          propName: args.propName,
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
    machine
  )
}
