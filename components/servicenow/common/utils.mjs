import { ConfigurationError } from "@pipedream/platform";

export function parseObject(value) {
  if (!value) return undefined;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new ConfigurationError(`Invalid JSON: ${value}`);
    }
  }

  return value;
}
