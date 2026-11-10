import {
  createHash, randomUUID,
} from "crypto";

/**
 * Serializes a value to JSON with object keys sorted, so two objects with the
 * same fields in a different order produce the same string.
 * @param {*} value - Any JSON-serializable value
 * @returns {string} The canonical JSON string
 */
export function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item ?? null)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const fields = Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${fields.join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/**
 * Picks the idempotency key for one looot run.
 *
 * Order: the key the user set, then a key derived from the workflow event
 * (`$.context.trace_id`, or `$.context.id`) plus the request body, then a
 * random key when the action runs with no event context.
 *
 * The derived key is the same on every retry of a step for one event, so looot
 * replays the first run instead of starting, and charging, a second one. The
 * request body is part of the hash so a changed input gets a new key, not a
 * `409 idempotency_conflict`.
 *
 * @param {object} opts
 * @param {string} [opts.userKey] - Key set in the Idempotency Key prop
 * @param {object} [opts.context] - `$.context` of the running step
 * @param {object} opts.request - The fields that define the run (endpointId, input, fallback)
 * @returns {{ key: string, source: "prop" | "event" | "random" }}
 */
export function resolveIdempotencyKey({
  userKey, context, request,
}) {
  const given = typeof userKey === "string"
    ? userKey.trim()
    : "";
  if (given) {
    return {
      key: given,
      source: "prop",
    };
  }
  const eventId = context?.trace_id ?? context?.id;
  if (eventId) {
    const digest = createHash("sha256")
      .update(stableStringify({
        eventId: String(eventId),
        workflowId: context?.workflow_id ?? null,
        request,
      }))
      .digest("hex")
      .slice(0, 40);
    return {
      key: `pipedream-${digest}`,
      source: "event",
    };
  }
  return {
    key: `pipedream-${randomUUID()}`,
    source: "random",
  };
}
