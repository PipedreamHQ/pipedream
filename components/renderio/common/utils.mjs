import { ConfigurationError } from "@pipedream/platform";

export function parseObject(value, label) {
  if (!value) return undefined;

  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      throw new ConfigurationError(`${label} must be valid JSON: ${error.message}`);
    }
  }

  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError(`${label} must be an object`);
  }

  return parsed;
}

export function parseRequiredObject(value, label) {
  const result = parseObject(value, label);
  if (!result) throw new ConfigurationError(`${label} is required`);
  return result;
}

export function parseArray(value, label) {
  if (!value) return [];

  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      throw new ConfigurationError(`${label} must be valid JSON: ${error.message}`);
    }
  }

  if (!Array.isArray(parsed)) {
    throw new ConfigurationError(`${label} must be an array`);
  }

  return parsed;
}

export function validateKeys(object, prefix, label) {
  const invalidKey = Object.keys(object).find((key) => !key.startsWith(prefix));
  if (invalidKey) {
    throw new ConfigurationError(`${label} keys must start with '${prefix}'`);
  }
}

export function normalizeList(response, key) {
  if (Array.isArray(response)) return response;
  return Array.isArray(response?.[key])
    ? response[key]
    : [];
}

export function getCommandId(command) {
  return command?.command_id || command?.id;
}

export function getRealTimestamp(entity) {
  const timestamp = entity?.created_at || entity?.updated_at || entity?.completed_at;
  if (!timestamp) return null;

  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed)
    ? null
    : parsed;
}

export function getTimestamp(entity) {
  return getRealTimestamp(entity) ?? Date.now();
}

export function isTerminalStatus(status) {
  return [
    "completed",
    "failed",
    "success",
    "error",
    "cancelled",
  ].includes(String(status || "").toLowerCase());
}
