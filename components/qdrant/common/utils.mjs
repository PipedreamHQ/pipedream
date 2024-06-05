import { ConfigurationError } from "@pipedream/platform";

function parsePointIds(values) {
  if (!values) {
    return undefined;
  }

  return values.map(parsePointId);
}

// Qdrant point IDs can either be unsigned integers or strings(UUIDs)
// https://qdrant.tech/documentation/concepts/points/#point-ids
function parsePointId(value) {
  if (String(value).length && !isNaN(value)) {
    const number = parseInt(value);
    if (number >= 0) {
      return number;
    } else {
      throw new ConfigurationError(`${value} is not an unsigned integer to be used as a point ID.`);
    }
  } else {
    return String(value);
  }
}

function parseVector(values) {
  if (!values) {
    return [];
  }

  return values.map(parseFloatValue);
}

function parseFloatValue(value) {
  if (String(value).length && !isNaN(value)) {
    return parseFloat(value);
  }

  throw new ConfigurationError("Make sure vector values are valid floats");
}

function emptyStrToUndefined(value) {
  const trimmed = typeof (value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof (valueToParse) === "object" || valueToParse === undefined) {
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
  parseVector,
  parsePointId,
  parsePointIds,
};
