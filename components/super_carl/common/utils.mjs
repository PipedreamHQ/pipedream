import { ConfigurationError } from "@pipedream/platform";

export const parseObjectProp = (value, label) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Fall through to a user-facing configuration error below.
    }
  }

  throw new ConfigurationError(`${label} must be a JSON object.`);
};

export const isEmptyValue = (value) => {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0 || value.every(isEmptyValue);
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0 || Object.values(value).every(isEmptyValue);
  }
  return false;
};

export const cleanValue = (value) => {
  if (Array.isArray(value)) {
    return value
      .map(cleanValue)
      .filter((item) => !isEmptyValue(item));
  }

  if (value && typeof value === "object") {
    return cleanObject(value);
  }

  return value;
};

export const cleanObject = (object = {}) => Object.fromEntries(
  Object.entries(object)
    .map((entry) => {
      const [
        key,
        value,
      ] = entry;

      return [
        key,
        cleanValue(value),
      ];
    })
    .filter(([
      , value,
    ]) => !isEmptyValue(value)),
);

export const requireQueryOrFilters = ({
  query, filters,
}) => {
  if (isEmptyValue(query) && isEmptyValue(filters)) {
    throw new ConfigurationError("Provide either a Query or Filters.");
  }
};

export const requireCommunicationTarget = (payload = {}) => {
  const targetKeys = [
    "target_user_id",
    "linkedin_profile_url",
    "linkedin_username",
    "x_profile_url",
    "x_username",
    "instagram_profile_url",
    "instagram_username",
    "recipient_email",
  ];

  if (targetKeys.every((key) => isEmptyValue(payload[key]))) {
    throw new ConfigurationError(
      "Provide at least one target identifier, such as Target User ID, LinkedIn Profile URL, X Username, Instagram Username, or Recipient Email.",
    );
  }
};

export const buildCommunicationPayload = ({
  channel,
  message,
  subject,
  targetUserId,
  linkedinProfileUrl,
  linkedinUsername,
  xProfileUrl,
  xUsername,
  instagramProfileUrl,
  instagramUsername,
  recipientEmail,
  connectorUserId,
  context,
  idempotencyKey,
  delegateUserId,
}, extra = {}) => cleanObject({
  channel,
  message,
  subject,
  target_user_id: targetUserId,
  linkedin_profile_url: linkedinProfileUrl,
  linkedin_username: linkedinUsername,
  x_profile_url: xProfileUrl,
  x_username: xUsername,
  instagram_profile_url: instagramProfileUrl,
  instagram_username: instagramUsername,
  recipient_email: recipientEmail,
  connector_user_id: connectorUserId,
  context,
  idempotency_key: idempotencyKey,
  delegate_user_id: delegateUserId,
  ...extra,
});

export const countSummary = ({
  total, rows, rowLabel,
}) => {
  const rowCount = Array.isArray(rows)
    ? rows.length
    : 0;

  if (Number.isFinite(total)) {
    return `Found ${total} ${rowLabel}; returned ${rowCount}.`;
  }

  return `Returned ${rowCount} ${rowLabel}.`;
};

const UNSAFE_PATH_SEGMENTS = new Set([
  "__proto__",
  "constructor",
  "prototype",
]);

// `fields` is user-supplied (search-jobs.mjs, search-posts.mjs), and these
// paths are split on "." and used to read/write into plain objects below.
// Reject __proto__/constructor/prototype segments so a field path can't
// traverse into (getPath) or pollute (setPath) the shared prototype chain.
const isUnsafePath = (path) => path
  .split(".")
  .some((segment) => UNSAFE_PATH_SEGMENTS.has(segment));

const getPath = (object, path) => {
  if (isUnsafePath(path)) {
    return undefined;
  }
  return path
    .split(".")
    .reduce((acc, key) => (acc && typeof acc === "object"
      ? acc[key]
      : undefined), object);
};

const setPath = (object, path, value) => {
  if (isUnsafePath(path)) {
    return;
  }
  const keys = path.split(".");
  let cursor = object;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (typeof cursor[key] !== "object" || cursor[key] === null) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
};

const pluckFields = (row, fields) => {
  if (!row || typeof row !== "object") {
    return row;
  }
  const result = {};
  for (const field of fields) {
    const value = getPath(row, field);
    if (value !== undefined) {
      setPath(result, field, value);
    }
  }
  return result;
};

// Rows from Super Carl's search endpoints carry deep, verbose per-row metadata
// (connection evidence, resolution provenance, etc.) that regularly pushes a
// single call past the MCP output ceiling. `fields` is additive: omitted, the
// row set returned is unchanged from today.
export const applyFieldSelection = (rows, fields) => {
  if (!Array.isArray(fields) || fields.length === 0 || !Array.isArray(rows)) {
    return rows;
  }
  return rows.map((row) => pluckFields(row, fields));
};

// Internal search-engine execution telemetry (Elasticsearch strategy, query
// embedding flags, filter provenance, bitmap counts, raw es_response, etc.)
// that Super Carl's people-search endpoint always includes at the top level,
// unrelated to `fields` (which only scopes each row). Large enough on its own
// to blow the MCP output ceiling regardless of row count. Undocumented and
// not actionable for a caller, so it's dropped unconditionally, not gated
// behind an opt-in — there's no described use case that would need it back.
// `search_metadata` is excluded from this list: it's part of the documented
// response schema, unlike the other fields here.
const SEARCH_PEOPLE_DEBUG_FIELDS = [
  "entity_resolution",
];

export const stripDebugFields = (response, keys) => {
  if (!response || typeof response !== "object") {
    return response;
  }
  const result = {
    ...response,
  };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

export const stripSearchPeopleDebugFields = (response) =>
  stripDebugFields(response, SEARCH_PEOPLE_DEBUG_FIELDS);
