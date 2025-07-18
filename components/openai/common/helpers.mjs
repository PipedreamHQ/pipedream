import { ConfigurationError } from "@pipedream/platform";

export function parseToolsArray(arr) {
  if (!arr) return undefined;
  return arr.map((value) => {
    if ([
      "file_search",
      "code_interpreter",
    ].includes(value)) {
      return {
        type: value,
      };
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  });
}

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

export function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof(valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError("Make sure the schema contains a valid JSON object.");
  }
}

export const parseJson = (input, maxDepth = 100) => {
  const seen = new WeakSet();
  const parse = (value) => {
    if (maxDepth <= 0) {
      return value;
    }
    if (typeof(value) === "string") {
      // Only parse if the string looks like a JSON object or array
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          return parseJson(JSON.parse(value), maxDepth - 1);
        } catch (e) {
          return value;
        }
      }
      return value;
    } else if (typeof(value) === "object" && value !== null && !Array.isArray(value)) {
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      return Object.entries(value)
        .reduce((acc, [
          key,
          val,
        ]) => Object.assign(acc, {
          [key]: parse(val),
        }), {});
    } else if (Array.isArray(value)) {
      return value.map((item) => parse(item));
    }
    return value;
  };

  return parse(input);
};

export function parseArray (input, maxDepth = 100) {
  if (!Array.isArray(input)) {
    return input;
  }

  return input.map((item) => parseJson(item, maxDepth));
}
