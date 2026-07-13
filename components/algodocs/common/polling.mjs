const FIRST_RUN_LIMIT = 25;

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
  const rawTs = record.processedAt || record.uploadedAt;
  if (!rawTs) {
    return null;
  }
  const ts = Date.parse(rawTs);
  return Number.isNaN(ts)
    ? null
    : ts;
}

export const lastTsMethods = {
  _getLastTs() {
    return this.db.get("lastTs");
  },
  _setLastTs(ts) {
    this.db.set("lastTs", ts);
  },
};

/**
 * Shared polling loop for AlgoDocs' event sources: fetches extraction records,
 * skips ones already seen (by a `lastTs` watermark), turns each qualifying
 * record into zero or more emittable entries via `extractItems`, caps the
 * first run to avoid flooding, applies `matchesFilter`, and emits.
 */
export async function pollForNewItems({
  component, fetchResponse, extractItems, matchesFilter,
}) {
  const response = await fetchResponse();
  const records = normalizeRecords(response);
  if (!records.length) {
    return;
  }

  const lastTs = component._getLastTs();
  const isFirstRun = lastTs == null;

  // The API returns records newest-first, so we iterate in that order.
  const entries = [];
  for (const record of records) {
    const ts = getRecordTimestamp(record);

    if (ts == null) {
      console.error(`Skipping AlgoDocs record ${record.id}: missing or unparseable processedAt/uploadedAt timestamp`);
      continue;
    }

    // On subsequent runs skip records strictly older than last-seen timestamp.
    // Records at exactly lastTs are re-evaluated so same-timestamp newcomers
    // with different IDs are not missed; dedupe: "unique" prevents re-emitting.
    if (!isFirstRun && ts < lastTs) {
      continue;
    }

    entries.push(...extractItems(record, ts));
  }

  // On first run, cap to the most recent entries to avoid flooding.
  const candidates = isFirstRun
    ? entries.slice(0, FIRST_RUN_LIMIT)
    : entries;

  // On first run, everything below the oldest examined (capped) candidate is
  // intentionally never looked at again. On later runs, every examined entry
  // advances the watermark, matched or not, so an unmatched entry isn't
  // rescanned forever and a matched-but-older entry is never skipped.
  let watermark = lastTs ?? 0;
  if (isFirstRun && candidates.length) {
    watermark = Math.min(...candidates.map((entry) => entry.ts));
  }

  for (const entry of candidates) {
    if (!isFirstRun && entry.ts > watermark) {
      watermark = entry.ts;
    }

    if (!matchesFilter(entry)) {
      continue;
    }

    component.$emit(entry.payload, {
      id: entry.id,
      summary: entry.summary,
      ts: entry.ts,
    });
  }

  if (watermark > (lastTs ?? 0)) {
    component._setLastTs(watermark);
  }
}
