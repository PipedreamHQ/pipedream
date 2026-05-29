import { ConfigurationError } from "@pipedream/platform";

export function parseRowIds(raw) {
  let rowIds;
  try {
    const parsed = JSON.parse(raw);
    rowIds = Array.isArray(parsed)
      ? parsed
      : [
        parsed,
      ];
  } catch {
    rowIds = raw.split(",").map((id) => id.trim())
      .filter(Boolean);
  }
  const numeric = rowIds.map(Number);
  if (!numeric.length || numeric.some((id) => !Number.isFinite(id))) {
    throw new ConfigurationError("`Row IDs` must be a comma-separated list of numeric row IDs or a JSON array of numbers.");
  }
  return numeric;
}
