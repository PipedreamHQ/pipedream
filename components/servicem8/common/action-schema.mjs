import { bodyFromFields } from "./payload.mjs";

/**
 * Build Pipedream props object from a field schema.
 * @param {object} app
 * @param {Array<object>} schema
 * @returns {Record<string, object>}
 */
export function buildPropsFromSchema(app, schema) {
  return Object.fromEntries(schema.map((field) => [
    field.prop,
    field.propDefinition
      ? {
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
      }
      : {
        type: field.type,
        label: field.label,
        ...(field.optional !== undefined && {
          optional: field.optional,
        }),
        ...(field.description && {
          description: field.description,
        }),
      },
  ]));
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
