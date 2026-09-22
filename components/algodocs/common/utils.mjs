export function normalizeRecords(response) {
  return Array.isArray(response)
    ? response
    : (response?.data ?? []);
}

// Returns the record's epoch ms timestamp, or `null` if `processedAt`/`uploadedAt`
// is missing or unparseable. Never falls back to the current wall-clock time:
// doing so would give the same record a different timestamp on every poll and
// could advance the `lastTs` watermark past records that are still processing.
export function getRecordTimestamp(record) {
  const rawTs = record?.processedAt || record?.uploadedAt;
  if (!rawTs) {
    return null;
  }
  const ts = Date.parse(rawTs);
  return Number.isNaN(ts)
    ? null
    : ts;
}
