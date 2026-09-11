import { ConfigurationError } from "@pipedream/platform";

export function checkIdArray(value) {
  if (typeof value === "string") {
    return value.split(",").map((id) => id.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value;
  }
  throw new ConfigurationError("Invalid ID array input: " + JSON.stringify(value));
}

/**
 * DealCloud field type ids, as returned by the entry-type schema endpoint.
 * Used to coerce a supplied value into the shape the cells API expects.
 */
export const FIELD_TYPES = {
  TEXT: 1,
  CHOICE: 2,
  NUMBER: 3,
  DATE: 4,
  REFERENCE: 5,
  BOOLEAN: 6,
  USER: 7,
  BINARY: 13,
  ENTRY_LIST_ID: 14,
  COUNTER: 15,
  IMAGE: 16,
  DATA_SOURCE: 17,
  CURRENCY: 18,
};
