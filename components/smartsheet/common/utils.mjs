import { ConfigurationError } from "@pipedream/platform";

const ROW_IDS_ERROR = "`Row IDs` must be a comma-separated list of positive integer row IDs or a JSON array of positive integers.";

// Accepts a positive integer (number or digit-only string), rejects
// JS-coercible junk like `true`, `[123]`, `"1.5"`, `0`, and negatives.
export function toPositiveInteger(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  if (typeof value === "string" && /^[1-9]\d*$/.test(value.trim())) {
    return Number(value.trim());
  }
  return NaN;
}

export function parseRowIds(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new ConfigurationError(ROW_IDS_ERROR);
  }
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
  const numeric = rowIds.map(toPositiveInteger);
  if (!numeric.length || numeric.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new ConfigurationError(ROW_IDS_ERROR);
  }
  return numeric;
}
