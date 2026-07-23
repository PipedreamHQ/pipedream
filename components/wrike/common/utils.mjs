import { ConfigurationError } from "@pipedream/platform";

export const parseJson = (json) => {
  if (!json) return undefined;

  if (typeof json === "string") {
    try {
      return JSON.parse(json);
    } catch (error) {
      throw new ConfigurationError(`Invalid JSON string: ${json}`);
    }
  }

  return json;
};

export const stringifyJson = (json) => {
  if (!json) return undefined;

  if (typeof json === "object" || Array.isArray(json)) {
    return JSON.stringify(json);
  }

  return json;
};
