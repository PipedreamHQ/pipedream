import { ConfigurationError } from "@pipedream/platform";

function isJson(value) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}

function valueToObject(value) {
  if (typeof(value) === "object") {
    return value;
  }

  if (!isJson(value)) {
    throw new ConfigurationError(`Make sure the custom expression contains a valid JSON object: \`${value}\``);
  }

  return JSON.parse(value);
}

export default {
  valueToObject,
};
