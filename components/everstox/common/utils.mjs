import { ConfigurationError } from "@pipedream/platform";

export const parseJsonProp = (json, propName) => {
  if (!json) {
    return undefined;
  }
  if (typeof json === "string") {
    try {
      return JSON.parse(json);
    } catch (error) {
      throw new ConfigurationError(`Invalid JSON string for property ${propName}: ${json}`);
    }
  }
  return json;
};
