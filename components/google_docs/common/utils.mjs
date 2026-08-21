import { ConfigurationError } from "@pipedream/platform";

function getTextContentFromDocument(content) {
  let textContent = "";
  content.forEach((element) => {
    if (element.paragraph) {
      element.paragraph.elements.forEach((textRun) => {
        if (textRun.textRun) {
          textContent += textRun.textRun.content;
        }
      });
    }
  });
  return textContent;
}

function addTextContentToDocument(response) {
  const textContent = getTextContentFromDocument(response.body.content);
  return {
    textContent,
    ...response,
  };
}

function flattenTables(content) {
  return (content || [])
    .filter((element) => element.table)
    .map((element) => ({
      startIndex: element.startIndex,
      endIndex: element.endIndex,
      table: element.table,
    }));
}

// Selects the table that was just inserted by ordinal position, not by
// comparing startIndex values: inserting a table immediately before an
// existing one gives the new table the exact startIndex the existing table
// used to have, and shifts the existing table forward onto some other index.
// Comparing indexes alone can't tell which of the two is "new" in that case,
// so instead we count how many tables preceded the insertion point (before
// inserting) and read off the table at that same position afterwards — a
// newly inserted table can only ever occupy the slot at that ordinal index.
function selectInsertedTable(beforeTables, afterTables, requestedIndex) {
  if (afterTables.length !== beforeTables.length + 1) {
    return null;
  }
  const precedingCount = requestedIndex == null
    ? beforeTables.length
    : beforeTables.filter(({ startIndex }) => startIndex < requestedIndex).length;
  return afterTables[precedingCount] ?? null;
}

function adjustPropDefinitions(props, app) {
  return Object.fromEntries(
    Object.entries(props).map(([
      key,
      prop,
    ]) => {
      if (typeof prop === "string") return [
        key,
        prop,
      ];
      const {
        propDefinition, ...otherValues
      } = prop;
      if (propDefinition) {
        const [
          , ...otherDefs
        ] = propDefinition;
        return [
          key,
          {
            propDefinition: [
              app,
              ...otherDefs,
            ],
            ...otherValues,
          },
        ];
      }
      return [
        key,
        otherValues.type === "app"
          ? null
          : otherValues,
      ];
    })
      .filter(([
        , value,
      ]) => value),
  );
}

/**
 * RFC 3339 date (`2026-01-31`) or date-time (`2026-01-31T00:00:00Z`). A
 * date-time must carry a `Z` or numeric offset, as RFC 3339 requires: without
 * one, `Date.parse` silently reads it in the runner's local timezone.
 */
const RFC_3339_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:[Tt](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2}))?$/;

/**
 * Validate an RFC 3339 timestamp and normalize it to a UTC ISO string.
 *
 * `Date.parse` alone is too permissive to use as the gate: it accepts
 * locale-ambiguous input like `01/02/2026` and bare years like `2026`, and it
 * rolls impossible dates over (`2026-02-31` becomes March 3) rather than
 * rejecting them. Either would silently filter from the wrong instant.
 *
 * @param {String} value the user-supplied timestamp
 * @param {String} label the prop label, used in the error message
 * @returns {String} the timestamp normalized to a UTC ISO string
 */
function parseRfc3339(value, label) {
  const match = RFC_3339_REGEX.exec(String(value).trim());
  if (!match) {
    throw new ConfigurationError(`Invalid ${label} "${value}". Use an RFC 3339 timestamp, e.g. "2026-01-31T00:00:00Z" or "2026-01-31".`);
  }
  const [
    , year,
    month,
    day,
  ] = match.map(Number);
  // The shape is right, but `2026-02-31` still parses, so confirm the calendar
  // date round-trips unchanged before trusting it.
  const utc = new Date(Date.UTC(year, month - 1, day));
  const parsed = Date.parse(match[0]);
  if (utc.getUTCFullYear() !== year
    || utc.getUTCMonth() !== month - 1
    || utc.getUTCDate() !== day
    || Number.isNaN(parsed)) {
    throw new ConfigurationError(`Invalid ${label} "${value}". That is not a real date or time.`);
  }
  return new Date(parsed).toISOString();
}

export default {
  getTextContentFromDocument,
  addTextContentToDocument,
  flattenTables,
  selectInsertedTable,
  adjustPropDefinitions,
  parseRfc3339,
};
