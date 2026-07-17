import { ConfigurationError } from "@pipedream/platform";

export const parseJson = (value) => {
  if (!value) return undefined;
  if (typeof value == "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new ConfigurationError(`Invalid JSON: ${value}`);
    }
  }
  return value;
};
