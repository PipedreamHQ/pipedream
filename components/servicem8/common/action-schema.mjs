import * as logic from "./logic.mjs";
import { bodyFromFields } from "./payload.mjs";

/**
 * Build Pipedream props object from a field schema.
 * UUID fields (propDefinition ending in "Uuid") get inline async options in the component.
 * @param {object} app
 * @param {Array<object>} schema
 * @returns {Record<string, object>}
 */
export function buildPropsFromSchema(app, schema) {
  return Object.fromEntries(schema.map((field) => {
    if (field.propDefinition?.endsWith("Uuid")) {
      const resource = field.propDefinition.replace(/Uuid$/, "");
      const {
        label, noun,
      } = logic.RESOURCES[resource] ?? {
        label: resource,
        noun: resource,
      };
      return [
        field.prop,
        {
          type: "string",
          label,
          description: field.description ?? `Select a ${noun} or enter its UUID`,
          ...(field.optional !== undefined && {
            optional: field.optional,
          }),
          async options({
            $, prevContext,
          }) {
            return this.servicem8._uuidOptionsForResource({
              $: $ ?? this,
              resource,
              prevContext,
            });
          },
        },
      ];
    }
    if (field.propDefinition) {
      return [
        field.prop,
        {
          propDefinition: [
            app,
            field.propDefinition,
          ],
          ...(field.optional !== undefined && {
            optional: field.optional,
          }),
          ...(field.description && {
            description: field.description,
          }),
        },
      ];
    }
    return [
      field.prop,
      {
        type: field.type,
        label: field.label,
        ...(field.optional !== undefined && {
          optional: field.optional,
        }),
        ...(field.description && {
          description: field.description,
        }),
        ...(field.options && {
          options: field.options,
        }),
      },
    ];
  }));
}

/**
 * Map component props to API fields based on schema definitions.
 * @param {object} component
 * @param {Array<object>} schema
 * @returns {Record<string, unknown>}
 */
export function fieldsFromSchema(component, schema) {
  const fields = {};
  for (const field of schema) {
    const rawValue = component[field.prop];
    fields[field.api] = field.transform
      ? field.transform(rawValue)
      : rawValue;
  }
  return bodyFromFields(fields);
}

/**
 * Clone schema with every field marked optional (typical for update actions).
 * @param {Array<object>} schema
 * @returns {Array<object>}
 */
export function allOptional(schema) {
  return schema.map((field) => ({
    ...field,
    optional: true,
  }));
}
