import { ConfigurationError } from "@pipedream/platform";

function parseArray(value) {
  try {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error("Not an array");
    }

    return parsedValue;

  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid array object");
  }
}

export default {
  parseArray,
};
