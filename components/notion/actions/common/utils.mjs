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

function isString(value) {
  return typeof (value) === "string" && value.trim();
}

function parseStringToJSON(value, defaultValue = {}) {
  return isString(value)
    ? JSON.parse(value)
    : defaultValue;
}

function formatPropertyToProp(value, type) {
  let property = {};

  switch (type) {
  case "number":
  case "checkbox":
  case "phone_number":
  case "email":
  case "url":
  case "created_time":
    property[type] = value;
    break;
  case "rich_text":
  case "title":
    property[type] = [
      {
        type: "text",
        text: {
          content: value,
        },
      },
    ];
    break;
  case "select":
    property[type] = {
      id: value,
    };
    break;
  case "relation":
    value = parseStringToJSON(value, value);

    property[type] = value.map((id) => ({
      id,
    }));
    break;
  case "multi_select":
    value = parseStringToJSON(value, value);

    property[type] = value.map((name) => ({
      name,
    }));
    break;
  case "date":
    property[type] = {
      start: value,
    };
    break;
  case "people":
    value = parseStringToJSON(value, value);

    property[type] = value.map((id) => ({
      id,
    }));
    break;
  case "files":
    value = parseStringToJSON(value, value);

    property[type] = value.map((url) => ({
      name: url.slice(0, 99),
      type: "external",
      external: {
        url,
      },
    }));
  }

  return property;
}

export default {
  buildTextProperty,
  buildBlock,
  emptyStrToUndefined,
  parseStringToJSON,
  formatPropertyToProp,
};
