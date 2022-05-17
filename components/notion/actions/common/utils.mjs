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

/**
 * Builds a Notion block object
 * @param {string} type - The block type
 * @param {list} propList - A list of block object values for the block type, following the format:
 *  [
 *    {
 *      label: text,
 *      value: "some text",
 *    },
 *    {
 *      label: checked,
 *      value: true,
 *    }
 *  ]
 */
function buildBlock(type, propList = []) {
  const blockProps =
    propList.reduce((props, prop) => ({
      ...props,
      [prop.label]: prop.label === "text" || prop.label === "rich_text"
        ? buildTextProperty(prop.value)
        : prop.value,
    }), {});

  return {
    object: "block",
    type,
    [type]: {
      ...blockProps,
    },
  };
}

function emptyStrToUndefined(value) {
  const trimmed = typeof (value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parseStringToJSON(value, defaultValue = {}) {
  return this.emptyStrToUndefined(value)
    ? JSON.parse(value)
    : defaultValue;
}

export default {
  buildTextProperty,
  buildBlock,
  emptyStrToUndefined,
  parseStringToJSON,
};
