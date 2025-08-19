/**
 * Builds Notion text property for Notion blocks
 * @param {string} content - The text content
 * @returns
 */
function buildTextProperty(content) {
  return [
    {
      type: "text",
      text: {
        content,
      },
    },
  ];
}

function isString(value) {
  return typeof (value) === "string" && value.trim();
}

function parseStringToJSON(value, defaultValue = {}) {
  return isString(value)
    ? JSON.parse(value)
    : defaultValue;
}

function parseArray(value) {
  return typeof value === "string"
    ? JSON.parse(value)
    : value;
}

function parseObject(obj) {
  if (!obj) {
    return null;
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(parseObject);
  }
  if (typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      parseObject(value),
    ]));
  }
  return obj;
}

export default {
  buildTextProperty,
  parseStringToJSON,
  parseArray,
  parseObject,
};
