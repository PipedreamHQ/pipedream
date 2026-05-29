import { ConfigurationError } from "@pipedream/platform";

type ParsedObject = Record<string, unknown>;

function parseObject(value: unknown, label: string): ParsedObject {
  if (typeof value === "string") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new ConfigurationError(`${label} "${value}" is not a valid JSON object`);
    }
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as ParsedObject;
    }
    throw new ConfigurationError(`Each ${label} must be an object, got: ${value}`);
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as ParsedObject;
  }
  throw new ConfigurationError(`Each ${label} must be an object, got: ${JSON.stringify(value)}`);
}

export function parseObjectArray(input: unknown, label: string): ParsedObject[] {
  // Single object → wrap in array
  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    return [
input as ParsedObject,
    ];
  }

  // String → parse then normalize
  if (typeof input === "string") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      throw new ConfigurationError(`${label} must be a valid JSON string`);
    }
    if (Array.isArray(parsed)) {
      return parsed.map((item) => parseObject(item, label));
    }
    if (typeof parsed === "object" && parsed !== null) {
      return [
parsed as ParsedObject,
      ];
    }
    throw new ConfigurationError(`${label} must be an object or an array of objects`);
  }

  // Array → map each element
  if (Array.isArray(input)) {
    return input.map((item) => parseObject(item, label));
  }

  throw new ConfigurationError(`${label} must be an array of objects`);
}
