import constants from "../common/constants.mjs";
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

async function buildPropertyProps(pageId) {
  const props = {};
  const { properties } = await this.notion.retrievePage(pageId);

  for (const propertyName in properties) {
    const property = properties[propertyName];

    if (!constants.NOTION_PROPERTIES[property.type]) continue;

    const {
      type,
      example,
    } = constants.NOTION_PROPERTIES[property.type];

    const prop = {
      label: propertyName,
      description: `The type of this property is \`${property.type}\`. [See ${property.type} type docs here](https://developers.notion.com/reference/property-object#${property.type}-configuration) ` + (example
        ? (" E.g. " + `\`${example}\``)
        : ""),
      type,
      optional: true,
    };

    props[propertyName] = prop;
  }
  return props;
}

export default {
  buildTextProperty,
  buildBlock,
  emptyStrToUndefined,
  parseStringToJSON,
  formatPropertyToProp,
  buildPropertyProps,
};
