const FIRST_RUN_LIMIT = 25;

export function normalizeRecords(response) {
  return Array.isArray(response)
    ? response
    : (response?.data ?? []);
}

export function getRecordTimestamp(record) {
  const rawTs = record.processedAt || record.uploadedAt;
  return rawTs
    ? Date.parse(rawTs)
    : Date.now();
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

  let maxTs = lastTs ?? 0;

  for (const entry of candidates) {
    if (!matchesFilter(entry)) {
      continue;
    }

    component.$emit(entry.payload, {
      id: entry.id,
      summary: entry.summary,
      ts: entry.ts,
    });

    if (entry.ts > maxTs) {
      maxTs = entry.ts;
    }
  }

  if (maxTs > (lastTs ?? 0)) {
    component._setLastTs(maxTs);
  }
}
