import { V1Component } from "@pipedream/sdk"
import { z, ZodRawShape } from "zod"
import { CONFIGURE_COMPONENT_TOOL_NAME } from "./const"
import { ConfigurableProp } from "@pipedream/sdk"
import { ASYNC_OPTIONS_TOOL_NAME } from "./tools/async-options-tool"

export const componentMapper = (
  component: V1Component,
  asyncOptions?: boolean,
  configurableProps?: any[]
) => {
  const schema: ZodRawShape = {}

  let configurablePropsDescription = ""
  let appKey: string | undefined = undefined
  for (const cp of configurableProps ||
    (component.configurable_props as ConfigurableProp[])) {
    if (cp.hidden) {
      continue
    }

    if (cp.type === "app") {
      // XXX handled directly in implementation
      // TODO: Handle multiple apps
      appKey = cp.name
      continue
    } else if (cp.type === "string") {
      if (cp.options && Array.isArray(cp.options) && cp.options.length > 0) {
        if (cp.options.some((o) => typeof o === "string")) {
          schema[cp.name] = z.enum(cp.options)
        } else if (cp.options.some((o) => typeof o === "object")) {
          schema[cp.name] = z.enum(cp.options.map((o) => o.value))
        } else {
          schema[cp.name] = z.string()
        }
      } else {
        schema[cp.name] = z.string()
      }
    } else if (cp.type === "string[]") {
      if (cp.options && Array.isArray(cp.options) && cp.options.length > 0) {
        if (cp.options.some((o) => typeof o === "string")) {
          schema[cp.name] = z.array(z.enum(cp.options))
        } else if (cp.options.some((o) => typeof o === "object")) {
          schema[cp.name] = z.array(z.enum(cp.options.map((o) => o.value)))
        } else {
          schema[cp.name] = z.array(z.string())
        }
      } else {
        schema[cp.name] = z.array(z.string())
      }
      // XXX maybe get rid of this, since the schema should communicate this correctly?
      configurablePropsDescription += `- ${cp.name}: Return JSON in this format: string[]\n`
    } else if (cp.type === "$.discord.channel") {
      schema[cp.name] = z.string()
      configurablePropsDescription += `- ${cp.name}: This property is a channel ID, not the channel name. You can get a list of name/id using the CONFIGURE_COMPONENT tool.\n`
    } else if (cp.type === "$.discord.channel[]") {
      schema[cp.name] = z.array(z.string())
      configurablePropsDescription += `- ${cp.name}: This property is a channel ID, not the channel name. You can get a list of name/id using the CONFIGURE_COMPONENT tool.\n`
    } else if (cp.type === "object") {
      schema[cp.name] = z.object({}).passthrough()
    } else if (cp.type === "any") {
      schema[cp.name] = z.any()
    } else if (cp.type === "number") {
      schema[cp.name] = z.number()
    } else if (cp.type === "number[]") {
      schema[cp.name] = z.array(z.number())
    } else if (cp.type === "integer") {
      schema[cp.name] = z.number().int()
    } else if (cp.type === "integer[]") {
      schema[cp.name] = z.array(z.number().int())
    } else if (cp.type === "boolean") {
      schema[cp.name] = z.boolean()
    } else if (cp.type === "boolean[]") {
      schema[cp.name] = z.array(z.boolean())
    } else if (cp.type === "$.interface.http") {
      // not yet supported
    } else if (cp.type === "$.interface.timer") {
      // not yet supported
    } else if (cp.type === "$.service.db") {
      // not yet supported
    } else if (cp.type === "datastore") {
      // not yet supported
    } else if (cp.type === "http_request") {
      // not yet supported
    } else if (cp.type === "sql") {
      // not yet supported
    } else if (cp.type === "alert") {
      // ignore alerts, as no user input required
    } else {
      console.error("unhandled type. Skipping", cp.name, cp.type)
    }

    if (schema[cp.name]) {
      if (cp.optional) {
        schema[cp.name] = schema[cp.name].optional().nullable()
      }

      let description: string = cp.description || ""

      if (cp.hidden) {
        description += `\n\nIMPORTANT: This property is hidden. Do not configure it and leave it blank.\n`
      }

      if (cp.remoteOptions) {
        if (asyncOptions) {
          description += `\n\nAlways use ${ASYNC_OPTIONS_TOOL_NAME}_${component.key.toUpperCase()}_${cp.name.toUpperCase()} to fetch the valid values`
        } else {
          description += `\n\nYou can use the "${CONFIGURE_COMPONENT_TOOL_NAME}" tool using these parameters to get the values. key: ${component.key}, propName: ${cp.name}`
        }
        if (cp.name.includes("id")) {
          description += `\n\nIMPORTANT: An ID is required for this property. If you don't have the id and only have the name, use the "${CONFIGURE_COMPONENT_TOOL_NAME}" tool to get the values.`
        }
      }

      if (description.trim()) {
        schema[cp.name] = schema[cp.name].describe(description.trim())
      }
    }
  }

  const description = `
${component.description ?? "No description available"}

${configurablePropsDescription ? "\n\n\n\nIMPORTANT: The arguments have specific formats. Please follow the instructions below:\n" + configurablePropsDescription : ""}
    `.trim()

  return {
    description,
    schema,
    appKey,
  }
}
