import { createHash } from "node:crypto";

import bannerify from "../../bannerify.app.mjs";
import sampleEmit from "./test-event.mjs";

const MAX_DEDUPE_ID_LENGTH = 64;
const timestampFields = [
  "timestamp",
  "created_at",
  "createdAt",
  "time",
  "event_time",
  "eventTime",
];

const stableHash = (value) => createHash("sha256")
  .update(typeof value === "string"
    ? value
    : JSON.stringify(value))
  .digest("hex");

const normalizeDedupeId = (value, fallbackPayload) => {
  const id = value == null || value === ""
    ? stableHash(fallbackPayload)
    : String(value);

  return id.length > MAX_DEDUPE_ID_LENGTH
    ? stableHash(id)
    : id;
};

const parseTimestamp = (value) => {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value < 1_000_000_000_000
        ? value * 1000
        : value
      : null;
  }

  const parsed = Date.parse(String(value));

  return Number.isNaN(parsed)
    ? null
    : parsed;
};

const getEventTimestamp = (body) => {
  for (const field of timestampFields) {
    const ts = parseTimestamp(body?.[field]);

    if (ts != null) {
      return ts;
    }
  }

  return Date.now();
};

export default {
  key: "bannerify-new-render-webhook",
  name: "New Render Webhook",
  description: "Emit new event when Bannerify or another service sends a render callback to the generated webhook URL.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    bannerify,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  sampleEmit,
  async run(event) {
    const body = event.body ?? {};
    const id = normalizeDedupeId(body.id ?? event.headers?.["x-request-id"], body);
    const summary = body.url
      ? `Bannerify render ${body.url}`
      : "Bannerify render event";

    this.$emit(body, {
      id,
      summary,
      ts: getEventTimestamp(body),
    });

    await this.http.respond({
      status: 200,
      body: {
        ok: true,
      },
    });
  },
};
