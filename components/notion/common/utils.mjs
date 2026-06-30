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

/**
 * Extracts a Notion object ID (page, block, or data source) from a raw ID or a
 * Notion URL. Notion URLs end in a 32-character hex ID (with or without dashes),
 * e.g. `https://www.notion.so/My-Page-200d6f3e1c2f80a3b4c5...`. Returns the ID
 * formatted as a UUID. If no 32-char hex is found, returns the trimmed input
 * unchanged (so already-clean IDs and unexpected formats pass through).
 * @param {string} input - A Notion ID or a URL containing one
 * @returns {string} the UUID-formatted ID
 */
function extractNotionId(input) {
  if (!input) {
    return input;
  }
  const compact = String(input).trim()
    .replace(/-/g, "");
  const matches = compact.match(/[0-9a-fA-F]{32}/g);
  if (!matches) {
    return String(input).trim();
  }
  const raw = matches[matches.length - 1];
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
}

/**
 * Parses a flat `{ name: value }` properties input that may arrive as a JSON
 * string (from an MCP/LLM caller) or as an object. Each value is left as-is
 * unless it is itself a JSON-encoded string, in which case it is parsed. Returns
 * undefined for empty input.
 * @param {(string|object)} properties - JSON string or object of property values
 * @returns {object|undefined}
 */
function parsePropertiesObject(properties) {
  if (properties == null || properties === "") {
    return undefined;
  }
  if (typeof properties === "string") {
    let parsedString;
    try {
      parsedString = JSON.parse(properties);
    } catch {
      throw new Error("Could not parse `properties` as a JSON object");
    }
    if (!parsedString || typeof parsedString !== "object" || Array.isArray(parsedString)) {
      throw new Error("`properties` must be a JSON object");
    }
    properties = parsedString;
  } else if (typeof properties !== "object" || Array.isArray(properties)) {
    throw new Error("`properties` must be a JSON object");
  }
  const parsed = {};
  for (const [
    key,
    value,
  ] of Object.entries(properties)) {
    try {
      parsed[key] = typeof value === "string"
        ? JSON.parse(value)
        : value;
    } catch {
      parsed[key] = value;
    }
  }
  return parsed;
}

/**
 * Normalizes a database column-schema JSON into the shape the Notion API
 * expects. Accepts shorthand where a column maps directly to a type name
 * (`{ "Quantity": "number" }` → `{ "Quantity": { "number": {} } }`) and
 * `{ type }` objects missing their type key (`{ "type": "checkbox" }` →
 * `{ "checkbox": {}, "type": "checkbox" }`). Fully-formed schema objects
 * (e.g. `{ "select": { "options": [...] } }`) pass through unchanged.
 * @param {(string|object)} properties - JSON string or object of column schemas
 * @returns {object|undefined}
 */
function normalizeDatabaseSchema(properties) {
  let parsed;
  if (typeof properties === "string") {
    try {
      parsed = JSON.parse(properties);
    } catch {
      throw new Error("Could not parse database schema as a JSON object");
    }
  } else {
    parsed = parseObject(properties);
  }
  if (!parsed) {
    return undefined;
  }
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Database schema must be a JSON object");
  }
  return Object.fromEntries(Object.entries(parsed).map(([
    key,
    value,
  ]) => {
    if (typeof value === "string") {
      return [
        key,
        {
          [value]: {},
        },
      ];
    }
    if (value && typeof value === "object" && "type" in value) {
      const typeKey = value.type;
      if (typeKey && typeof typeKey === "string" && !(typeKey in value)) {
        return [
          key,
          {
            ...value,
            [typeKey]: {},
          },
        ];
      }
    }
    return [
      key,
      value,
    ];
  }));
}

export default {
  buildTextProperty,
  parseStringToJSON,
  parseArray,
  parseObject,
  extractNotionId,
  parsePropertiesObject,
  normalizeDatabaseSchema,
};
