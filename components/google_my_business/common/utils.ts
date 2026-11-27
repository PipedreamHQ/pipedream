// Helpers shared by the Performance API actions.

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

const pad = (n: number): string => String(n).padStart(2, "0");

// Accepts `1234567890` or `locations/1234567890` (also with an `accounts/…` prefix) and
// returns the bare id.
export function parseLocationId(value: string): string {
  const id = String(value ?? "").trim()
    .split("/")
    .filter(Boolean)
    .pop();
  if (!id) {
    throw new Error("`Location ID` is required, e.g. `1234567890123456789`. Use **List Locations** to find it.");
  }
  return id;
}

// Parses `YYYY-MM-DD` and rejects dates that don't exist (2026-02-30).
export function parseDate(value: string, label: string): DateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? "").trim());
  if (!match) {
    throw new Error(`\`${label}\` must look like \`2026-01-31\` (YYYY-MM-DD), got \`${value}\``);
  }
  const [
    year,
    month,
    day,
  ] = match.slice(1).map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    throw new Error(`\`${label}\` is not a real calendar date: \`${value}\``);
  }
  return {
    year,
    month,
    day,
  };
}

// Parses `YYYY-MM`.
export function parseMonth(value: string, label: string): Omit<DateParts, "day"> {
  const match = /^(\d{4})-(\d{2})$/.exec(String(value ?? "").trim());
  const month = match
    ? Number(match[2])
    : 0;
  if (!match || month < 1 || month > 12) {
    throw new Error(`\`${label}\` must look like \`2026-01\` (YYYY-MM), got \`${value}\``);
  }
  return {
    year: Number(match[1]),
    month,
  };
}

export function formatDate({
  year, month, day,
}: DateParts): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

// Parses both ends of a daily range and rejects a range that ends before it starts.
export function parseDailyRange(startDate: string, endDate: string): {
  start: DateParts; end: DateParts;
} {
  const start = parseDate(startDate, "Start Date");
  const end = parseDate(endDate, "End Date");
  if (formatDate(start) > formatDate(end)) {
    throw new Error(`\`End Date\` (${endDate}) is before \`Start Date\` (${startDate})`);
  }
  return {
    start,
    end,
  };
}

// Query-string keys for a daily range. Google binds nested dates by their
// snake_case names (`dailyRange.start_date.year`), as in its own example requests.
export function dailyRangeParams(start: DateParts, end: DateParts): Record<string, number> {
  return {
    "dailyRange.start_date.year": start.year,
    "dailyRange.start_date.month": start.month,
    "dailyRange.start_date.day": start.day,
    "dailyRange.end_date.year": end.year,
    "dailyRange.end_date.month": end.month,
    "dailyRange.end_date.day": end.day,
  };
}

interface RawTimeSeries {
  datedValues?: {
    date?: Partial<DateParts>;
    value?: string | number;
  }[];
}

// Turns Google's `{ date: {year, month, day}, value: "12" }` points into
// `{ date: "2026-01-05", value: 12 }`. A point with no `value` means Google reported
// no number for that day, so it stays `null` rather than becoming 0.
export function flattenTimeSeries(timeSeries?: RawTimeSeries): {
  total: number; datedValues: { date: string; value: number | null; }[];
} {
  const datedValues = (timeSeries?.datedValues ?? []).map(({
    date, value,
  }) => ({
    date: formatDate(date as DateParts),
    value: value === undefined || value === null
      ? null
      : Number(value),
  }));
  return {
    total: datedValues.reduce((sum, { value }) => sum + (value ?? 0), 0),
    datedValues,
  };
}
