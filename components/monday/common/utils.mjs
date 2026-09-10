import { ConfigurationError } from "@pipedream/platform";

function emptyStrToUndefined(value) {
  const trimmed = typeof value === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function strinfied(value) {
  return typeof value === "object"
    ? JSON.stringify(value)
    : emptyStrToUndefined(value);
}

function strNumber(value) {
  return Number.isInteger(parseInt(value, 10))
    ? parseInt(value, 10)
    : emptyStrToUndefined(value);
}

function toNumber(value) {
  return typeof value === "number"
    ? value
    : strNumber(value);
}

/**
 * Parses a flat `{ columnId: value }` input that may arrive as a JSON string (from
 * an MCP/LLM caller) or as an object. Each value is left as-is unless it is itself
 * a JSON-encoded string, in which case it is parsed — column types such as `email`
 * or `location` take an object payload. Returns undefined for empty input.
 * @param {(string|object)} columnValues - JSON string or object of column values
 * @returns {object|undefined}
 */
export function parseColumnValues(columnValues) {
  if (columnValues == null || columnValues === "") {
    return undefined;
  }
  let values = columnValues;
  if (typeof values === "string") {
    try {
      values = JSON.parse(values);
    } catch {
      throw new ConfigurationError("Could not parse `Column Values` as a JSON object");
    }
  }
  if (typeof values !== "object" || Array.isArray(values)) {
    throw new ConfigurationError("`Column Values` must be a JSON object of column ID → value pairs");
  }
  const parsed = {};
  for (const [
    key,
    value,
  ] of Object.entries(values)) {
    // Only strings that are themselves JSON objects/arrays are parsed. Parsing every
    // string would turn a text column's `"123"` into a number, which monday rejects.
    const isJsonLiteral = typeof value === "string" && /^\s*[[{]/.test(value);
    try {
      parsed[key] = isJsonLiteral
        ? JSON.parse(value)
        : value;
    } catch {
      parsed[key] = value;
    }
  }
  return Object.keys(parsed).length
    ? parsed
    : undefined;
}

export function getColumnOptions(allColumnData, columnId, useLabels = false) {
  const columnOptions = allColumnData?.find(
    ({ id }) => id === columnId,
  )?.settings_str;
  if (columnOptions) {
    try {
      const labels = JSON.parse(columnOptions).labels;
      return (Array.isArray(labels)
        ? labels.map(({
          id, name,
        }) => useLabels
          ? name
          : ({
            label: name,
            value: id.toString(),
          }))
        : Object.entries(labels).map(
          ([
            value,
            label,
          ]) => useLabels
            ? label
            : ({
              label: label !== ""
                ? label
                : value,
              value,
            }),
        )).filter((str) => str);
    } catch (err) {
      console.log(`Error parsing options for column "${columnId}": ${err}`);
    }
  }
}

export default {
  emptyStrToUndefined,
  strinfied,
  toNumber,
};
