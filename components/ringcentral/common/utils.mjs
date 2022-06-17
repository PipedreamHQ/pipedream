import { ConfigurationError } from "@pipedream/platform";

function emptyObjectToUndefined(value) {
  if (typeof(value) !== "object" || Array.isArray(value)) {
    return value;
  }

  if (!Object.keys(value).length) {
    return undefined;
  }

  const reduction = Object.entries(value)
    .reduce((reduction, [
      key,
      value,
    ]) => {
      if (!emptyStrToUndefined(value)) {
        return reduction;
      }
      return {
        ...reduction,
        [key]: value,
      };
    }, {});

  return Object.keys(reduction).length
    ? reduction
    : undefined;
}

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof(valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid object");
  }
}

export default {
  emptyStrToUndefined,
  parse,
  emptyObjectToUndefined,
};
