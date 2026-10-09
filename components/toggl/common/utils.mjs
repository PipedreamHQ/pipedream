import { ConfigurationError } from "@pipedream/platform";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDate = (value, label) => {
  if (!DATE_PATTERN.test(value)) {
    throw new ConfigurationError(`${label} must use the YYYY-MM-DD format.`);
  }

  const [
    year,
    month,
    day,
  ] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    throw new ConfigurationError(`${label} must be a valid calendar date.`);
  }

  return date.getTime();
};

const getHeader = (headers, name) => headers?.[name]
  ?? headers?.[Object.keys(headers || {}).find((key) => key.toLowerCase() === name)];

const parseCursorHeader = (headers, name) => {
  const value = getHeader(headers, name);

  if (value === undefined || value === null || value === "") return null;

  const parsedValue = Number(value);

  if (!Number.isSafeInteger(parsedValue) || parsedValue < 0) {
    throw new Error(`Toggl returned an invalid ${name} pagination header.`);
  }

  return value;
};

export const getNextCursor = (headers) => {
  const firstId = parseCursorHeader(headers, "x-next-id");
  const firstRowNumber = parseCursorHeader(headers, "x-next-row-number");

  if (firstId !== null && firstRowNumber === null) {
    throw new Error("Toggl returned an incomplete pagination cursor. Expected x-next-row-number with x-next-id.");
  }

  return firstRowNumber === null
    ? null
    : {
      ...firstId !== null && {
        firstId,
      },
      firstRowNumber,
    };
};

export const parseCursorInput = (cursor) => {
  if (cursor === undefined || cursor === null || cursor === "") return null;

  let parsedCursor = cursor;

  if (typeof cursor === "string") {
    try {
      parsedCursor = JSON.parse(cursor);
    } catch {
      throw new ConfigurationError("Cursor must be a JSON object returned by a previous run.");
    }
  }

  if (typeof parsedCursor !== "object" || Array.isArray(parsedCursor)) {
    throw new ConfigurationError("Cursor must be an object returned by a previous run.");
  }

  const firstId = parsedCursor.firstId ?? parsedCursor.first_id;
  const firstRowNumber = parsedCursor.firstRowNumber ?? parsedCursor.first_row_number;

  if (firstId === undefined && firstRowNumber === undefined) return null;

  if (firstId !== undefined && firstRowNumber === undefined) {
    throw new ConfigurationError("Cursor First Row Number is required when Cursor First ID is provided.");
  }

  const parseValue = (value, label) => {
    if (value === undefined) return undefined;

    const parsed = Number(value);

    if (!Number.isSafeInteger(parsed) || parsed < 0) {
      throw new ConfigurationError(`${label} must be a non-negative integer.`);
    }

    return parsed;
  };

  return {
    firstId: parseValue(firstId, "Cursor First ID"),
    firstRowNumber: parseValue(firstRowNumber, "Cursor First Row Number"),
  };
};

const formatDate = (date) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const dateInTimezone = (date, timezone) => {
  let parts;

  try {
    parts = new globalThis.Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
  } catch {
    throw new ConfigurationError(`Timezone must be a valid IANA timezone. Received: ${timezone}`);
  }

  const values = Object.fromEntries(parts.map((part) => [
    part.type,
    part.value,
  ]));

  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
};

export const resolveDateRange = ({
  startDate,
  endDate,
  datePreset,
  timezone = "UTC",
  weekStart = 1,
  now = new Date(),
}) => {
  if (datePreset && (startDate || endDate)) {
    throw new ConfigurationError("Use either a Date Preset or explicit Start Date and End Date values, not both.");
  }

  if (!datePreset) {
    if (!startDate || !endDate) {
      throw new ConfigurationError("Start Date and End Date are required when Date Preset is not provided.");
    }

    const startTimestamp = parseDate(startDate, "Start Date");
    const endTimestamp = parseDate(endDate, "End Date");

    if (startTimestamp > endTimestamp) {
      throw new ConfigurationError("End Date must be the same as or after Start Date.");
    }

    return {
      startDate,
      endDate,
      timezone: null,
    };
  }

  if (![
    "last_week",
    "last_month",
    "this_week",
  ].includes(datePreset)) {
    throw new ConfigurationError(`Unsupported Date Preset: ${datePreset}`);
  }

  if (!Number.isInteger(weekStart) || weekStart < 0 || weekStart > 6) {
    weekStart = 1;
  }

  const today = dateInTimezone(now, timezone);
  let start;
  let end;

  if (datePreset === "last_month") {
    start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
    end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0));
  } else {
    const daysSinceWeekStart = (today.getUTCDay() - weekStart + 7) % 7;
    const thisWeekStart = addDays(today, -daysSinceWeekStart);

    if (datePreset === "this_week") {
      start = thisWeekStart;
      end = today;
    } else {
      start = addDays(thisWeekStart, -7);
      end = addDays(thisWeekStart, -1);
    }
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    timezone,
  };
};

const normalizeSearchValue = (value) => value?.trim().toLowerCase();

export const filterWorkspaceUsers = (users, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  const activeUsers = (users || []).map((user) => ({
    userId: user.id,
    name: user.fullname ?? user.name ?? "",
    email: user.email ?? "",
  }));

  if (!normalizedQuery) return activeUsers;

  return activeUsers.filter((user) => normalizeSearchValue(user.name)?.includes(normalizedQuery)
    || normalizeSearchValue(user.email)?.includes(normalizedQuery));
};

export const resolveWorkspaceUser = (users, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  const candidates = filterWorkspaceUsers(users, query);
  const exactMatches = candidates.filter((user) => (
    normalizeSearchValue(user.name) === normalizedQuery
    || normalizeSearchValue(user.email) === normalizedQuery
  ));
  const matches = exactMatches.length
    ? exactMatches
    : candidates;

  if (matches.length === 1) return matches[0];

  if (!matches.length) {
    throw new ConfigurationError(`No accessible workspace user matched "${query}".`);
  }

  const choices = matches
    .slice(0, 10)
    .map((user) => `${user.name} (${user.userId})`)
    .join(", ");
  throw new ConfigurationError(`User Name is ambiguous. Use a full name, email, or User ID. Matches: ${choices}`);
};
