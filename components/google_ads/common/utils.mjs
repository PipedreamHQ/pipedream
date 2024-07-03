import { ConfigurationError } from "@pipedream/platform";

export function parseObject(value = {}) {
  return Object.fromEntries(Object.entries(value).map(([
    key,
    value,
  ]) => {
    try {
      return [
        key,
        JSON.parse(value),
      ];
    } catch (err) {
      return [
        key,
        value,
      ];
    }
  }));
}

export function parseStringObject(value = "{}") {
  try {
    return typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch (err) {
    throw new ConfigurationError(`Error parsing JSON value \`${value}\`
\\
**${err.toString()}**`);
  }
}

export function getOption(label, prefix) {
  return {
    label,
    value: `${prefix}.${label}`,
  };
}

export function checkPrefix(value, prefix) {
  const checkStr = (s) => s && (s?.startsWith?.(prefix)
    ? s
    : `${prefix}.${s}`);
  return Array.isArray(value ?? [])
    ? (value ?? []).map(checkStr)
    : checkStr(value);
}
