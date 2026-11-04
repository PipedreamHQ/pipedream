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

export const parseContinuation = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw new ConfigurationError("Continuation must be the object returned by a previous project activity call.");
    }
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new ConfigurationError("Continuation must be the object returned by a previous project activity call.");
  }

  return value;
};

export const sortNumbers = (values, label) => {
  const numbers = (values || []).map(Number);

  if (numbers.some((value) => !Number.isSafeInteger(value) || value < 1)) {
    throw new ConfigurationError(`${label} must contain only positive integer IDs.`);
  }

  return [
    ...new Set(numbers),
  ].sort((a, b) => a - b);
};

export const nonBlankStrings = (values) => (values || [])
  .map((value) => String(value).trim())
  .filter(Boolean);

export const parseProviderTotals = (value) => {
  if (!value || typeof value !== "object") {
    throw new Error("Toggl returned an invalid report totals response.");
  }

  if (value.seconds === null) {
    throw new Error("Toggl returned an invalid tracked-seconds total.");
  }

  const trackedSeconds = Number(value.seconds);

  if (!Number.isFinite(trackedSeconds)) {
    throw new Error("Toggl returned an invalid tracked-seconds total.");
  }

  const rates = Array.isArray(value.rates)
    ? value.rates
    : [];
  const billableSeconds = rates.reduce((sum, rate) => {
    const seconds = Number(rate?.billable_seconds || 0);

    if (!Number.isFinite(seconds)) {
      throw new Error("Toggl returned an invalid billable-seconds total.");
    }

    return sum + seconds;
  }, 0);

  return {
    trackedSeconds,
    billableSeconds,
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

export const resolveNamedResource = ({
  resources,
  query,
  resourceLabel,
  queryLabel,
  allowMultipleExact = false,
}) => {
  const normalizedQuery = normalizeSearchValue(query);
  const candidates = resources.filter((resource) => (
    normalizeSearchValue(resource.name)?.includes(normalizedQuery)
    || normalizeSearchValue(resource.clientName)?.includes(normalizedQuery)
  ));
  const exactMatches = candidates.filter((resource) => (
    normalizeSearchValue(resource.name) === normalizedQuery
  ));
  const matches = exactMatches.length
    ? exactMatches
    : candidates;

  if (allowMultipleExact && exactMatches.length) return exactMatches;

  if (matches.length === 1) {
    return allowMultipleExact
      ? matches
      : matches[0];
  }

  if (!matches.length) {
    throw new ConfigurationError(`No accessible ${resourceLabel} matched "${query}".`);
  }

  const choices = matches
    .slice(0, 10)
    .map((resource) => `${resource.name} (${resource.id})${resource.clientName
      ? ` - ${resource.clientName}`
      : ""}`)
    .join(", ");
  throw new ConfigurationError(`${queryLabel} is ambiguous. Use an exact name or ID. Matches: ${choices}`);
};

export const unwrapItems = (response, label) => {
  const items = Array.isArray(response)
    ? response
    : response?.items;

  if (!Array.isArray(items)) {
    throw new Error(`Toggl returned an invalid ${label} response.`);
  }

  return items;
};

export const mapWorkspaceProjects = (projects) => projects.map((project) => ({
  id: Number(project.id),
  name: project.name ?? "",
  clientId: project.client_id ?? project.cid ?? null,
  clientName: project.client_name ?? null,
  active: project.active !== false,
}));

export const filterWorkspaceProjects = (projects, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  const mapped = mapWorkspaceProjects(projects);

  if (!normalizedQuery) return mapped;

  return mapped.filter((project) => (
    normalizeSearchValue(project.name)?.includes(normalizedQuery)
    || normalizeSearchValue(project.clientName)?.includes(normalizedQuery)
  ));
};

export const resolveWorkspaceProject = (projects, query) => resolveNamedResource({
  resources: mapWorkspaceProjects(projects),
  query,
  resourceLabel: "workspace project",
  queryLabel: "Project Name",
});

export const mapProjectTasks = (tasks) => tasks.map((task) => ({
  id: Number(task.id),
  name: task.name ?? "",
  projectId: Number(task.project_id),
  active: task.active !== false,
}));

export const filterProjectTasks = (tasks, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  const mapped = mapProjectTasks(tasks);

  if (!normalizedQuery) return mapped;

  return mapped.filter((task) => normalizeSearchValue(task.name)?.includes(normalizedQuery));
};

export const resolveProjectTask = (tasks, query) => resolveNamedResource({
  resources: mapProjectTasks(tasks),
  query,
  resourceLabel: "project task",
  queryLabel: "Task Name",
});

export const filterWorkspaceUsers = (users, query) => {
  const normalizedQuery = normalizeSearchValue(query);
  const activeUsers = (users || []).map((user) => {
    const isActive = user.is_active ?? user.active;
    const isAdmin = user.is_admin ?? user.admin ?? user.workspace_admin;

    return {
      userId: user.id,
      name: user.fullname ?? user.name ?? "",
      email: user.email ?? "",
      ...user.role !== undefined && {
        role: user.role,
      },
      ...isActive !== undefined && {
        isActive: Boolean(isActive),
      },
      ...user.inactive !== undefined && {
        inactive: Boolean(user.inactive),
      },
      ...isAdmin !== undefined && {
        isAdmin: Boolean(isAdmin),
      },
    };
  });

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
