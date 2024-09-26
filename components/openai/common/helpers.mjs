import { ConfigurationError } from "@pipedream/platform";

export function parseToolsArray(arr) {
  if (!arr) return undefined;
  return arr.map((value) => {
    if ([
      "retrieval",
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
