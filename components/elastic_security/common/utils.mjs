export function pickFields(obj, fields) {
  if (!fields?.length || !obj || typeof obj !== "object") {
    return obj;
  }
  const picked = {};
  for (const field of fields) {
    if (field in obj) {
      picked[field] = obj[field];
    }
  }
  return picked;
}

// Kibana rejects backfill windows ending in the future; back the default "now" off by a
// minute so request latency and clock skew can't push it past Kibana's server clock.
const RUN_WINDOW_BUFFER_MS = 60 * 1000;
const RUN_WINDOW_DEFAULT_SPAN_MS = 60 * 60 * 1000;

export function getDefaultRunWindow({
  startDate, endDate,
}) {
  const resolvedEndDate = endDate ?? new Date(Date.now() - RUN_WINDOW_BUFFER_MS).toISOString();
  const resolvedStartDate = startDate
    ?? new Date(new Date(resolvedEndDate).getTime() - RUN_WINDOW_DEFAULT_SPAN_MS).toISOString();
  return {
    startDate: resolvedStartDate,
    endDate: resolvedEndDate,
  };
}
