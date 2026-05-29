import { ConfigurationError } from "@pipedream/platform";

const ROW_IDS_ERROR = "`Row IDs` must be a comma-separated list of positive integer row IDs or a JSON array of positive integers.";

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
  const numeric = rowIds.map(Number);
  if (!numeric.length || numeric.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new ConfigurationError(ROW_IDS_ERROR);
  }
  return numeric;
}
