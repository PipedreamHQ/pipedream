import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  z, ZodRawShape,
} from "zod"
import { createPdClient } from "./pd-client.js"
import { RunActionOpts } from "@pipedream/sdk"
import { getAuthProvision } from "./authProvisions.js"
import { ConfigureComponentRawSchema } from "./schemas.js"
import { CONFIGURE_COMPONENT_TOOL_NAME } from "./const.js"

interface SafeRegisterToolResult {
  success: boolean
  reason?: string
}

export async function registerComponentTools({
  server,
  app,
  externalUserId,
}: {
  server: McpServer
  app: string
  externalUserId: string
}): Promise<void> {
  // Create a single client instance to use throughout this function
  const pd = createPdClient()

  // Helper function to safely register a tool, catching "already registered" errors
  const safeRegisterTool = (
    name: string,
    description: string,
    schema: ZodRawShape,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: any,
  ): SafeRegisterToolResult => {
    try {
      server.tool(name, description, schema, handler)
      return {
        success: true,
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("already registered")
      ) {
        return {
          success: false,
          reason: "already_registered",
        }
      }
      throw error // Re-throw any other errors
    }
  }

  // Get all available Pipedream components (pre-built triggers and actions) for the app
  const components = await pd.getComponents({
    app,
    componentType: "action",
  })

  // Register each component as a tool
  for (const _component of components.data) {
    const component = (
      await pd.getComponent({
        key: _component.key,
      })
    ).data

    const schema: ZodRawShape = {}

    let configurablePropsDescription = ""
    let appKey: string | undefined = undefined

    // Process the configurable properties (input) for the component
    // https://pipedream.com/docs/workflows/contributing/components/api/#user-input-props
    for (const cp of component.configurable_props) {
      if (cp.type === "app") {
        // Handle app type specially
        appKey = cp.name
        continue
      } else if (cp.type === "string") {
        schema[cp.name] = z.string()
      } else if (cp.type === "string[]") {
        schema[cp.name] = z
          .union([
            z.string().transform((val) => {
              try {
                return JSON.parse(val)
              } catch {
                return [
                  val,
                ] // If not valid JSON, treat as single item array
              }
            }),
            z.array(z.string()),
          ])
          .refine((val) => Array.isArray(val), {
            message: "Must be an array of strings",
          })
        configurablePropsDescription += `- ${cp.name}: Return JSON in this format: string[]\n`
      } else if (cp.type === "number") {
        schema[cp.name] = z.number()
      } else if (cp.type === "integer") {
        schema[cp.name] = z.number().int()
      } else if (cp.type === "boolean") {
        schema[cp.name] = z.boolean()
      } else {
        console.error("unhandled type. Skipping", cp.name, cp.type)
      }

      // Add optional flag and description to the schema
      if (schema[cp.name]) {
        if (cp.optional) {
          schema[cp.name] = schema[cp.name].optional()
        }

        let description: string = cp.description || ""

        if (cp.remoteOptions) {
          description += `\n\nYou can use the "${CONFIGURE_COMPONENT_TOOL_NAME}" tool using these parameters to get the values. key: ${component.key}, propName: ${cp.name}`
          if (cp.name.includes("id")) {
            description += `\n\nIMPORTANT: An ID is required for this property. If you don't have the id and only have the name, use the "${CONFIGURE_COMPONENT_TOOL_NAME}" tool to get the values.`
          }
        }

        if (description.trim()) {
          schema[cp.name] = schema[cp.name].describe(description.trim())
        }
      }
    }

    // Create the tool description
    const description = `
${component.description ?? "No description available"}

${configurablePropsDescription
    ? "\n\n\n\nIMPORTANT: The arguments have specific formats. Please follow the instructions below:\n" + configurablePropsDescription
    : ""}
    `.trim()

    // Register the tool for this component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    safeRegisterTool(component.key, description, schema, async (_args: any) => {
      const args = z.object(schema).parse(_args)
      const authProvisionResponse = await getAuthProvision({
        app,
        externalUserId,
      })

      if (typeof authProvisionResponse === "string") {
        return {
          content: [
            {
              type: "text",
              text: authProvisionResponse,
            },
          ],
        }
      }

      // Run the action with the provided args
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
        externalUserId,
      }

      console.log(
        "Running action:",
        component.key,
        "for external user: [REDACTED]",
      )
      const response = await pd.runAction(requestOpts)

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      }
    })
  }

  // Register the configure component tool, a special tool that allows progressive prop configuration
  const configureComponentDescription = `
    You call this tool if you need to get the available options for a property of a component.
    The property description will tell you if you can use this tool and what the parameter values are.
    `
  safeRegisterTool(
    CONFIGURE_COMPONENT_TOOL_NAME,
    configureComponentDescription,
    ConfigureComponentRawSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (_args: any) => {
      const args = z.object(ConfigureComponentRawSchema).parse(_args)
      const authProvisionResponse = await getAuthProvision({
        app,
        externalUserId,
      })

      if (typeof authProvisionResponse === "string") {
        return {
          content: [
            {
              type: "text",
              text: authProvisionResponse,
            },
          ],
        }
      }

      // Get the configuration options for this property
      const response = await pd.configureComponent({
        componentId: {
          key: args.componentKey,
        },
        configuredProps: {
          [app]: {
            authProvisionId: authProvisionResponse.id,
          },
        },
        externalUserId,
        propName: args.propName,
      })

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      }
    },
  )
}
