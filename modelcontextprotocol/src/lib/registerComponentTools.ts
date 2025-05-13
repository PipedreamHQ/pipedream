import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { RunActionOpts } from "@pipedream/sdk"
import { z } from "zod"
import { pd } from "../pd-client"
import { getAuthProvision } from "./authProvisions"
import { componentMapper } from "./componentMapper"
import { CONFIGURE_COMPONENT_TOOL_NAME } from "./const"
import { safeRegisterTool } from "./safeRegisterTool"
import { ConfigureComponentRawSchema } from "./schemas"

export async function registerComponentTools({
  server,
  app,
  uuid,
  hashid,
}: {
  server: McpServer
  app: string
  uuid: string
  hashid: string
}) {
  const components = await pd.getComponents({
    app,
    componentType: "action",
    limit: 100,
  })

  /**
   * Track the app key used in the components
   *
   * XXX We may need a better way to handle this if the app key is ever deferent across components
   */
  let sharedAppKey: string | undefined = undefined

  for (const _component of components.data) {
    const component = (
      await pd.getComponent({
        key: _component.key,
      })
    ).data

    const { description, schema, appKey } = componentMapper(component, false)
    sharedAppKey = appKey

    safeRegisterTool(
      server,
      component.key,
      description,
      schema,
      async (_args) => {
        const args = z.object(schema).parse(_args)
        const authProvisionResponse = await getAuthProvision({
          app,
          uuid,
        })

        if (typeof authProvisionResponse === "string") {
          return {
            content: [
              {
                type: "text",
                text: authProvisionResponse,
                hashid,
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
            [appKey || app]: {
              authProvisionId: authProvisionResponse.id,
            },
          },
          externalUserId: uuid,
        }
        console.log(">> Running action", requestOpts)
        const response = await pd.runAction(requestOpts)
        console.log(">> Action response", response)
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
              hashid,
            },
          ],
        }
      }
    )
  }

  const configureComponentDescription = `
    You call this tool if you need to get the available options for a property of a component.
    The property description will tell you if you can use this tool and what the parameter values are.
    `
  safeRegisterTool(
    server,
    CONFIGURE_COMPONENT_TOOL_NAME,
    configureComponentDescription,
    ConfigureComponentRawSchema,
    async (_args) => {
      const args = z.object(ConfigureComponentRawSchema).parse(_args)
      const authProvisionResponse = await getAuthProvision({
        app,
        uuid,
      })

      if (typeof authProvisionResponse === "string") {
        return {
          content: [
            {
              type: "text",
              text: authProvisionResponse,
              hashid,
            },
          ],
        }
      }

      const response = await pd.configureComponent({
        componentId: {
          key: args.componentKey,
        },
        configuredProps: {
          [sharedAppKey || app]: {
            authProvisionId: authProvisionResponse.id,
          },
        },
        externalUserId: uuid,
        propName: args.propName,
      })

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
            hashid,
          },
        ],
      }
    }
  )
}
