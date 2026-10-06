import { ConfigurationError } from "@pipedream/platform";
import { MAX_CONCURRENT_REQUESTS } from "./constants.mjs";

const ROW_IDS_TOKENS = /^[1-9]\d*(\s*,\s*[1-9]\d*)*$/;
const ROW_IDS_ERROR = "`Row IDs` must be a comma-separated list of positive integer row IDs or a JSON array of positive integers.";

// IDs are 16 digits and never converted to numbers, so none can round. The spec types them
// `number`, but the API accepts strings.
export function toIdString(value, label = "ID") {
  const trimmed = String(value ?? "").trim();
  // Smartsheet never issues 0, so it is always a config mistake.
  if (!/^[1-9]\d*$/.test(trimmed)) {
    throw new ConfigurationError(`\`${label}\` must be a numeric Smartsheet ID, but received \`${value}\`.`);
  }
  return trimmed;
}

// Bounded fan-out: there is no bulk children endpoint, so a traversal is one request per
// workspace and unbounded Promise.all bursts.
export async function mapWithConcurrency(items, fn, limit = MAX_CONCURRENT_REQUESTS) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({
    length: Math.min(limit, items.length),
  }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) {
        return;
      }
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

// A model (or a human) asked for multiple values is just as likely to write a
// comma/semicolon-separated string as a real JSON array — split on either rather than
// treating the whole string as a single picklist option or a single (invalid) email.
const toValueArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string" && /[,;]/.test(value)) {
    return value.split(/[,;]/).map((v) => v.trim())
      .filter(Boolean);
  }
  return [
    value,
  ];
};

// Smartsheet rejects a plain `value` for MULTI_PICKLIST/MULTI_CONTACT_LIST columns — those
// require the richer `objectValue` shape instead. Every other column type keeps using `value`
// exactly as before.
export function buildCell(columnId, columnType, value, columnName, rowIndex) {
  if (columnType === "MULTI_PICKLIST") {
    const values = toValueArray(value);
    if (!values.length) {
      throw new ConfigurationError(`Row at index ${rowIndex}, column "${columnName}" has no valid values for a MULTI_PICKLIST column.`);
    }
    if (!values.every((v) => typeof v === "string")) {
      throw new ConfigurationError(`Row at index ${rowIndex}, column "${columnName}" must be a string or array of strings for a MULTI_PICKLIST column.`);
    }
    return {
      columnId,
      objectValue: {
        objectType: "MULTI_PICKLIST",
        values,
      },
    };
  }
  if (columnType === "MULTI_CONTACT_LIST") {
    const entries = toValueArray(value);
    if (!entries.length) {
      throw new ConfigurationError(`Row at index ${rowIndex}, column "${columnName}" has no valid values for a MULTI_CONTACT_LIST column.`);
    }
    const values = entries.map((entry) => {
      if (typeof entry === "string") {
        if (!entry.trim()) {
          throw new ConfigurationError(`Row at index ${rowIndex}, column "${columnName}" has a blank email for a MULTI_CONTACT_LIST column.`);
        }
        return {
          objectType: "CONTACT",
          email: entry,
        };
      }
      if (entry && typeof entry === "object" && typeof entry.email === "string") {
        if (!entry.email.trim()) {
          throw new ConfigurationError(`Row at index ${rowIndex}, column "${columnName}" has a blank email for a MULTI_CONTACT_LIST column.`);
        }
        return {
          objectType: "CONTACT",
          email: entry.email,
          ...(entry.name
            ? {
              name: entry.name,
            }
            : {}),
        };
      }
      throw new ConfigurationError(`Row at index ${rowIndex}, column "${columnName}" must be a string email, an object like {"email": "...", "name": "..."}, or an array of those for a MULTI_CONTACT_LIST column.`);
    });
    return {
      columnId,
      objectValue: {
        objectType: "MULTI_CONTACT",
        values,
      },
    };
  }
  return {
    columnId,
    value,
  };
}

export function parseRowIds(raw) {
  const trimmed = String(raw ?? "").trim();
  // Not JSON.parse: it would round a 16-digit ID before it could be checked. Validate the
  // whole input, then split.
  const inner = trimmed.startsWith("[") && trimmed.endsWith("]")
    ? trimmed.slice(1, -1).trim()
    : trimmed;
  if (!ROW_IDS_TOKENS.test(inner)) {
    throw new ConfigurationError(ROW_IDS_ERROR);
  }
  return inner.split(",").map((id) => id.trim());
}
