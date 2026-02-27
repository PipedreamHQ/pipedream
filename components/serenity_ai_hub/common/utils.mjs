/**
 * Parses input parameters into the API's key-value pair format.
 * Accepts either a JSON string (e.g. `'[{"key":"k","value":"v"}]'` or `'[]'`)
 * or an array of objects with `key` and `value` properties.
 * @param {string | { key: string, value: string }[]} params
 * @returns {{ key: string, value: string }[]}
 */
const parseInputParameters = (params) => {
  const parsed = typeof params === "string"
    ? JSON.parse(params)
    : params;

  if (!Array.isArray(parsed)) {
    throw new Error("Expected an array of objects with `key` and `value` properties");
  }

  return parsed.map((item, index) => {
    const entry = typeof item === "string"
      ? JSON.parse(item)
      : item;
    if (entry?.key === undefined || entry?.key === null) {
      throw new Error(`Item at index ${index} is missing the \`key\` property`);
    }
    if (entry?.value === undefined || entry?.value === null) {
      throw new Error(`Item at index ${index} is missing the \`value\` property`);
    }
    return {
      key: entry.key,
      value: entry.value,
    };
  });
};

export default {
  parseInputParameters,
};
