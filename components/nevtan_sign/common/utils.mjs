import { createHash } from "crypto";
import { ConfigurationError } from "@pipedream/platform";

// Pipedream only dedupes on the first 64 characters of an event ID.
const MAX_EVENT_ID_LENGTH = 64;

export const getEnvelopeId = (envelope) => envelope?._id ?? envelope?.id;

/**
 * Joins the parts into an event ID. If the result is longer than Pipedream's
 * dedupe limit, it is replaced with a hash of the same parts so the ID stays
 * deterministic and unique.
 */
export const buildEventId = (...parts) => {
  const id = parts.join("-");
  if (id.length <= MAX_EVENT_ID_LENGTH) {
    return id;
  }
  return createHash("sha256").update(id)
    .digest("hex");
};

export const parseObject = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new ConfigurationError(`Could not parse value as JSON: ${err.message}`);
  }
};
