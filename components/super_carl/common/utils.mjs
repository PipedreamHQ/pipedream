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
