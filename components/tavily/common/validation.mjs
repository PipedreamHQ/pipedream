import { ConfigurationError } from "@pipedream/platform";

export function validateRange(value, label, min, max, integer = true) {
  if (value === undefined) {
    return;
  }
  if (!Number.isFinite(value) || (integer && !Number.isInteger(value))
    || value < min || value > max) {
    throw new ConfigurationError(`${label} must be ${integer
      ? "an integer"
      : "a number"} between ${min} and ${max}.`);
  }
}

export function validateList(value, label, min, max) {
  if (value === undefined && min === 0) {
    return;
  }
  if (!Array.isArray(value) || value.length < min || value.length > max
    || value.some((item) => typeof item !== "string" || !item.trim())) {
    throw new ConfigurationError(`${label} must contain between ${min} and ${max} non-empty strings.`);
  }
}
