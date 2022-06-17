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

export default {
  buildTextProperty,
  parseStringToJSON,
};
