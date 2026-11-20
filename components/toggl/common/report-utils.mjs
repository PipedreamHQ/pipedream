const toFiniteNumber = (value, label) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`Toggl returned an invalid ${label}.`);
  }

  return number;
};

const getSubGroupValues = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  if ([
    "seconds",
    "tracked_seconds",
    "trackedSeconds",
    "billable_seconds",
    "billableSeconds",
    "rates",
    "ids",
    "time_entry_ids",
    "timeEntryIds",
    "sub_groups",
    "subGroups",
  ].some((key) => Object.hasOwn(value, key))) {
    return [
      value,
    ];
  }

  return Object.values(value).flatMap((item) => getSubGroupValues(item));
};

const getDirectMetric = (value, keys) => {
  for (const key of keys) {
    if (value?.[key] !== undefined && value[key] !== null) {
      return toFiniteNumber(value[key], key.replaceAll("_", " "));
    }
  }

  return null;
};

const getTrackedSeconds = (value) => {
  const direct = getDirectMetric(value, [
    "tracked_seconds",
    "trackedSeconds",
    "seconds",
  ]);

  if (direct !== null) return direct;

  const children = getSubGroupValues(value?.sub_groups ?? value?.subGroups);

  if (!children.length) return null;

  return children.reduce((sum, child) => {
    const seconds = getTrackedSeconds(child);

    if (seconds === null) {
      throw new Error("Toggl returned a summary group without tracked seconds.");
    }

    return sum + seconds;
  }, 0);
};

const getBillableSeconds = (value) => {
  const direct = getDirectMetric(value, [
    "billable_seconds",
    "billableSeconds",
  ]);

  if (direct !== null) return direct;

  if (Array.isArray(value?.rates)) {
    return value.rates.reduce((sum, rate) => sum + toFiniteNumber(
      rate?.billable_seconds ?? rate?.billableSeconds ?? 0,
      "billable seconds",
    ), 0);
  }

  const children = getSubGroupValues(value?.sub_groups ?? value?.subGroups);

  return children.reduce((sum, child) => sum + getBillableSeconds(child), 0);
};

const collectTimeEntryIds = (value, ids = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectTimeEntryIds(item, ids));
    return ids;
  }

  if (!value || typeof value !== "object") return ids;

  for (const [
    key,
    nestedValue,
  ] of Object.entries(value)) {
    if ([
      "ids",
      "time_entry_ids",
      "timeEntryIds",
    ].includes(key) && Array.isArray(nestedValue)) {
      nestedValue.forEach((id) => {
        if (id !== null && id !== undefined) ids.add(String(id));
      });
    } else {
      collectTimeEntryIds(nestedValue, ids);
    }
  }

  return ids;
};

/**
 * Validate an ungrouped detailed-report page before projecting its fields.
 *
 * @param {Object} opts - Validation options
 * @param {Array} opts.page - Raw Toggl report rows
 * @param {number} opts.expectedFirstRowNumber - Expected first row number
 * @param {Set<string>} opts.seenEntryIds - Entry IDs observed in prior pages
 * @returns {Object} Page integrity and duration statistics
 */
export const validateDetailedPage = ({
  page,
  expectedFirstRowNumber,
  seenEntryIds,
}) => {
  if (!Array.isArray(page)) {
    throw new Error("Toggl returned an invalid detailed report response.");
  }

  let entryCount = 0;
  let trackedSeconds = 0;
  let billableSeconds = 0;
  let expectedRowNumber = expectedFirstRowNumber;

  for (const row of page) {
    const rowNumber = Number(row?.row_number);

    if (!Number.isSafeInteger(rowNumber) || rowNumber < 1) {
      throw new Error("Toggl returned a detailed report row without a valid row number.");
    }

    if (rowNumber !== expectedRowNumber) {
      throw new Error(`Toggl detailed report pagination skipped or repeated rows. Expected row ${expectedRowNumber}, received ${rowNumber}.`);
    }

    expectedRowNumber++;

    if (!Array.isArray(row.time_entries) || !row.time_entries.length) {
      throw new Error(`Toggl detailed report row ${rowNumber} did not contain any time entries.`);
    }

    for (const entry of row.time_entries) {
      const id = Number(entry?.id);

      if (!Number.isSafeInteger(id) || id < 1) {
        throw new Error(`Toggl detailed report row ${rowNumber} contained an invalid time entry ID.`);
      }

      const idKey = String(id);

      if (seenEntryIds.has(idKey)) {
        throw new Error(`Toggl detailed report pagination returned duplicate time entry ID ${id}.`);
      }

      seenEntryIds.add(idKey);

      const seconds = toFiniteNumber(entry.seconds, "time entry duration");

      if (seconds < 0) {
        throw new Error(`Toggl detailed report time entry ${id} contained a negative duration.`);
      }

      entryCount++;
      trackedSeconds += seconds;
      if (row.billable) billableSeconds += seconds;
    }
  }

  return {
    reportRowCount: page.length,
    entryCount,
    trackedSeconds,
    billableSeconds,
    nextExpectedRowNumber: expectedRowNumber,
  };
};

/**
 * Convert the provider summary report to compact, normalized group totals.
 *
 * @param {Object} report - Toggl summary report response
 * @returns {Object} Compact groups and exact entry count
 */
export const compactSummaryReport = (report) => {
  if (!report || typeof report !== "object" || !Array.isArray(report.groups)) {
    throw new Error("Toggl returned a summary report without a groups array.");
  }

  const allEntryIds = new Set();
  const groups = report.groups.map((group) => {
    const trackedSeconds = getTrackedSeconds(group);

    if (trackedSeconds === null) {
      throw new Error("Toggl returned a summary group without tracked seconds.");
    }

    const groupEntryIds = collectTimeEntryIds(group?.sub_groups ?? group?.subGroups);
    groupEntryIds.forEach((id) => allEntryIds.add(id));

    if (trackedSeconds > 0 && !groupEntryIds.size) {
      throw new Error("Toggl returned a tracked summary group without time entry IDs.");
    }

    const names = Array.isArray(group.names)
      ? group.names.filter(Boolean)
      : [];

    return {
      id: group.id ?? group.ids?.[0] ?? null,
      name: names.join(" / ") || group.name || group.title || null,
      trackedSeconds,
      billableSeconds: getBillableSeconds(group),
      entryCount: groupEntryIds.size,
    };
  });

  return {
    groups,
    groupCount: groups.length,
    entryCount: allEntryIds.size,
  };
};
