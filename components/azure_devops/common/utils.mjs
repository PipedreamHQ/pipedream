// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";

export function parseObject(value, label) {
  if (!value) {
    return undefined;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    throw new ConfigurationError(`**${label}** must be valid JSON. Received: ${value}`);
  }
}

export function compactFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([
      ,
      value,
    ]) => value !== undefined && value !== null && value !== ""),
  );
}

export function buildFieldPatchDocument(fields, op) {
  return Object.entries(fields).map(([
    key,
    value,
  ]) => ({
    op,
    path: `/fields/${key}`,
    value,
  }));
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1
    ? singular
    : plural;
}
