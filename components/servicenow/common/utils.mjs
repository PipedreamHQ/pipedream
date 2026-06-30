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

export function assertSafeQueryValue(value, label) {
  if (typeof value === "string" && value.includes("^")) {
    throw new ConfigurationError(`\`${label}\` cannot contain the \`^\` character, which is reserved by ServiceNow's encoded-query syntax.`);
  }
}
