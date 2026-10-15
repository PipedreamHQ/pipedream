const ZERO_METRICS = {
  clicks: 0,
  impressions: 0,
  ctr: 0,
  position: 0,
};

const SORT_FIELDS = {
  clicks_delta: "clicks",
  impressions_delta: "impressions",
  ctr_delta: "ctr",
  position_delta: "position",
};

function round(value, digits) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function metricsOf(row = {}) {
  return {
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  };
}

function roundMetrics(metrics) {
  return {
    clicks: metrics.clicks,
    impressions: metrics.impressions,
    ctr: round(metrics.ctr, 4),
    position: round(metrics.position, 2),
  };
}

/**
 * `ctr` and `position` deltas are null when either side has no impressions: the zero
 * placeholder for an absent key is not a real rank, so subtracting it would report a
 * brand-new query at position 47 as a 47-place drop. Clicks and impressions are true
 * zeros there and keep their numeric delta.
 */
function deltaOf(current, previous) {
  const comparable = current.impressions !== 0 && previous.impressions !== 0;
  return {
    clicks: current.clicks - previous.clicks,
    impressions: current.impressions - previous.impressions,
    ctr: comparable
      ? current.ctr - previous.ctr
      : null,
    position: comparable
      ? current.position - previous.position
      : null,
  };
}

// null (not zero, not Infinity) when the previous period had nothing to grow from.
function pctOf(current, previous) {
  if (!previous) {
    return null;
  }
  return round((current - previous) / previous, 4);
}

function pctChangeOf(current, previous) {
  return {
    clicks: pctOf(current.clicks, previous.clicks),
    impressions: pctOf(current.impressions, previous.impressions),
  };
}

/**
 * Sums a period's rows. `ctr` is recomputed from the summed clicks/impressions and
 * `position` is an impression-weighted average — neither may be a plain mean of the
 * per-row values.
 */
export function summarizeRows(rows = []) {
  let clicks = 0;
  let impressions = 0;
  let weightedPosition = 0;

  for (const row of rows) {
    const metrics = metricsOf(row);
    clicks += metrics.clicks;
    impressions += metrics.impressions;
    weightedPosition += metrics.position * metrics.impressions;
  }

  return {
    clicks,
    impressions,
    ctr: impressions
      ? clicks / impressions
      : 0,
    position: impressions
      ? weightedPosition / impressions
      : 0,
  };
}

function sortComparedRows(rows, sortBy) {
  if (sortBy === "current_clicks") {
    return rows.sort((a, b) => b.current.clicks - a.current.clicks);
  }
  // Absolute delta so the biggest gains AND the biggest losses surface first. A null
  // delta has no magnitude to rank, so those rows go last rather than sorting as zero.
  const field = SORT_FIELDS[sortBy] || "clicks";
  return rows.sort((a, b) => {
    const aDelta = a.delta[field];
    const bDelta = b.delta[field];
    if (aDelta === null) {
      return bDelta === null
        ? 0
        : 1;
    }
    if (bDelta === null) {
      return -1;
    }
    return Math.abs(bDelta) - Math.abs(aDelta);
  });
}

/**
 * Joins two periods of search-analytics rows on their `keys` and computes per-row and
 * total deltas. Pure — no I/O — so the join, the sort and the totals are unit-testable.
 *
 * A key present in only one period gets `delta.ctr`/`delta.position` of null (there is no
 * rank on the missing side to compare against), and those rows sort last under
 * `ctr_delta`/`position_delta`. `delta.clicks`/`delta.impressions` stay numeric.
 */
export function buildComparison({
  currentRows = [],
  previousRows = [],
  sortBy = "clicks_delta",
  rowLimit = 50,
}) {
  const joined = new Map();

  for (const row of currentRows) {
    const keys = row.keys || [];
    joined.set(JSON.stringify(keys), {
      keys,
      current: metricsOf(row),
      previous: {
        ...ZERO_METRICS,
      },
    });
  }

  for (const row of previousRows) {
    const keys = row.keys || [];
    const id = JSON.stringify(keys);
    const entry = joined.get(id);
    if (entry) {
      entry.previous = metricsOf(row);
    } else {
      joined.set(id, {
        keys,
        current: {
          ...ZERO_METRICS,
        },
        previous: metricsOf(row),
      });
    }
  }

  const all = [
    ...joined.values(),
  ].map((entry) => ({
    keys: entry.keys,
    current: entry.current,
    previous: entry.previous,
    delta: deltaOf(entry.current, entry.previous),
    pct_change: pctChangeOf(entry.current, entry.previous),
  }));

  sortComparedRows(all, sortBy);

  const rows = all
    .slice(0, rowLimit)
    .map((row) => ({
      keys: row.keys,
      current: roundMetrics(row.current),
      previous: roundMetrics(row.previous),
      delta: roundMetrics(row.delta),
      pct_change: row.pct_change,
    }));

  const currentTotals = summarizeRows(currentRows);
  const previousTotals = summarizeRows(previousRows);

  return {
    totals: {
      current: roundMetrics(currentTotals),
      previous: roundMetrics(previousTotals),
      delta: roundMetrics(deltaOf(currentTotals, previousTotals)),
      pct_change: pctChangeOf(currentTotals, previousTotals),
    },
    rows,
    row_count: rows.length,
    has_more: all.length > rows.length,
  };
}

/** Formats a 0-1 fraction as a signed percentage for the run summary. */
export function formatPctChange(value) {
  if (value === null || value === undefined) {
    return "n/a";
  }
  const pct = round(value * 100, 1);
  return pct >= 0
    ? `+${pct}%`
    : `${pct}%`;
}
