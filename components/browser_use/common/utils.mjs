import { ConfigurationError } from "@pipedream/platform";

export function cleanObject(obj = {}) {
  return Object.fromEntries(Object.entries(obj).filter(([
    ,
    value,
  ]) => value !== undefined && value !== ""));
}

export function parseOptionalObject(value, label) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  if (typeof value !== "string") {
    throw new ConfigurationError(`${label} must be a JSON object.`);
  }
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error();
    }
    return parsed;
  } catch {
    throw new ConfigurationError(`${label} must be a valid JSON object.`);
  }
}

export function parseFileUploadItems(value) {
  if (!value) {
    return [];
  }
  let parsed;
  try {
    parsed = typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch {
    throw new ConfigurationError("File Upload Items JSON must be a valid JSON array.");
  }
  if (!Array.isArray(parsed)) {
    throw new ConfigurationError("File Upload Items JSON must be a JSON array.");
  }
  return parsed.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new ConfigurationError(`File upload item at index ${index} must be a JSON object.`);
    }
    if (!item.name) {
      throw new ConfigurationError(`File upload item at index ${index} must include a \`name\`.`);
    }
    return cleanObject({
      name: item.name,
      contentType: item.contentType || "application/octet-stream",
      size: item.size,
    });
  });
}

export function getProxyCountryCode(value) {
  if (!value) {
    return undefined;
  }
  if (value === "none") {
    return null;
  }
  return value.toLowerCase();
}

export function getCacheScriptValue(value) {
  if (!value || value === "auto") {
    return null;
  }
  return value === "enabled";
}
