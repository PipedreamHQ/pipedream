import {
  ConfigurableProps, V1Component,
} from "@pipedream/sdk";
import {
  z, ZodRawShape,
} from "zod";
import {
  extractEnumValues, toNonEmptyTuple,
} from "./lib/helpers";

export const configurablePropsToZod = (
  component: V1Component,
  options?: {
    asyncOptionsDescription?: string;
    configureComponentDescription?: string;
    configurableProps?: ConfigurableProps;
  },
) => {
  const schema: ZodRawShape = {};

  for (const cp of options?.configurableProps ||
    (component.configurable_props as ConfigurableProps)) {
    if (cp.hidden) {
      continue;
    }

    if (cp.type === "app") {
      // XXX handle directly in implementation
      continue;
    } else if (cp.type === "string") {
      if (cp.options && Array.isArray(cp.options) && cp.options.length > 0) {
        const enumValues = toNonEmptyTuple(extractEnumValues(cp.options));
        if (enumValues) {
          schema[cp.name] = z.enum(enumValues);
        } else {
          schema[cp.name] = z.string();
        }
      } else {
        schema[cp.name] = z.string();
      }
    } else if (cp.type === "string[]") {
      if (cp.options && Array.isArray(cp.options) && cp.options.length > 0) {
        const enumValues = toNonEmptyTuple(extractEnumValues(cp.options));
        if (enumValues) {
          schema[cp.name] = z.array(z.enum(enumValues));
        } else {
          schema[cp.name] = z.array(z.string());
        }
      } else {
        schema[cp.name] = z.array(z.string());
      }
    } else if (cp.type === "$.discord.channel") {
      schema[cp.name] = z.string();
    } else if (cp.type === "$.discord.channel[]") {
      schema[cp.name] = z.array(z.string());
    } else if (cp.type === "object") {
      schema[cp.name] = z.object({}).passthrough();
    } else if (cp.type === "any") {
      schema[cp.name] = z.any();
    } else if (cp.type === "integer") {
      schema[cp.name] = z.number().int();
    } else if (cp.type === "integer[]") {
      schema[cp.name] = z.array(z.number().int());
    } else if (cp.type === "boolean") {
      schema[cp.name] = z.boolean();
    } else if (cp.type === "boolean[]") {
      schema[cp.name] = z.array(z.boolean());
      // ignore alerts, as no user input required
    } else {
      console.error("unhandled type. Skipping", cp.name, cp.type);
    }

    if (schema[cp.name]) {
      if (cp.optional) {
        schema[cp.name] = schema[cp.name].optional().nullable();
      }

      let description: string = cp.description || "";

      if (cp.hidden) {
        description +=
          "\n\nIMPORTANT: This property is hidden. Do not configure it and leave it blank.\n";
      }

      if (cp.remoteOptions) {
        if (options?.asyncOptionsDescription) {
          if (options.configureComponentDescription) {
            description += `\n\n${options.asyncOptionsDescription}`;
          }
        } else {
          if (options?.configureComponentDescription) {
            description += `\n\n${options.configureComponentDescription}`;
          }
        }
        // if (cp.name.includes("id")) {
        //   description += `\n\nIMPORTANT: An ID is required for this property. If you don't have the id and only have the name, use the "${CONFIGURE_COMPONENT_TOOL_NAME}" tool to get the values.`;
        // }
      }

      if (description.trim()) {
        schema[cp.name] = schema[cp.name].describe(description.trim());
      }
    }
  }

  return schema;
};
