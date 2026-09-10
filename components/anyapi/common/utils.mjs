function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function schemaType(schema) {
  const type = schema?.type;
  return Array.isArray(type)
    ? type[0]
    : type;
}

function coerceStringToSchema(value, schema) {
  switch (schemaType(schema)) {
  case "string":
    return value;
  case "integer":
  case "number": {
    const parsed = Number(value);
    return value.trim() && Number.isFinite(parsed)
      ? parsed
      : value;
  }
  case "boolean":
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  case "object":
  case "array":
    return coerceToSchema(optionalParseAsJSON(value), schema);
  default:
    return optionalParseAsJSON(value);
  }
}

/**
 * Restores the JSON types an AnyAPI input schema declares, at every depth.
 * A field the schema types as `string` is left alone, so a numeric id such as
 * `"314216"` stays a string instead of becoming the number AnyAPI rejects.
 * A field with no schema keeps the previous best-effort JSON parse.
 *
 * @param {*} value - the value to normalize
 * @param {object} [schema] - the JSON Schema fragment describing `value`
 * @returns {*} the value with schema-declared types restored
 */
export function coerceToSchema(value, schema) {
  if (typeof value === "string") {
    return coerceStringToSchema(value, schema);
  }
  if (Array.isArray(value)) {
    return schema?.items
      ? value.map((entry) => coerceToSchema(entry, schema.items))
      : value;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([
        key,
        entry,
      ]) => [
        key,
        coerceToSchema(entry, schema?.properties?.[key]),
      ]),
    );
  }
  return value;
}

/**
 * Pipedream object props deliver every value the user typed as a string, while
 * AnyAPI validates the request against the API's JSON Schema and charges
 * nothing for a rejection. This restores the declared types before the request
 * is sent.
 *
 * @param {object|string} [value] - the raw object prop value
 * @param {object} [inputSchema] - the API's `inputSchema`, from **Get API**
 * @returns {object|undefined} the request body, or undefined when empty
 */
export function parseInput(value, inputSchema) {
  if (!value) return undefined;
  const obj = typeof value === "string"
    ? JSON.parse(value)
    : value;
  return coerceToSchema(obj, inputSchema);
}
