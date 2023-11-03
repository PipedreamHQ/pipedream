import { ConfigurationError } from "@pipedream/platform";

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
    throw new ConfigurationError(`Make sure the custom expression contains a valid JSON object: \`${valueToParse}\``);
  }
}

function parseElements(elements) {
  const parsed = parse(elements);

  if (!Object.keys(parsed).length) {
    throw new ConfigurationError(`The field must contain at least one element. \`${elements}\``);
  }

  return Object.fromEntries(
    Object.entries(parsed).map(([
      key,
      value,
    ]) => [
      key,
      parse(value),
    ]),
  );
}

export default {
  parseElements,
};
