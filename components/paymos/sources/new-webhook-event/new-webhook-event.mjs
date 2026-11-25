import paymos from "../../paymos.app.mjs";
import {
  DEFAULT_DEDUP_LIMIT,
  DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
  INVALID_WEBHOOK_SIGNATURE_PROBLEM,
  PAYMOS_CANONICAL_WEBHOOK_EVENTS,
  SEEN_EVENT_IDS_KEY,
  parseWebhookEvent,
  readSignatureHeader,
  trackSeenEventId,
  validateWebhookSecret,
} from "../../common/webhooks.mjs";

function respondUnauthorized(http) {
  http.respond({
    status: 401,
    headers: {
      "Content-Type": "application/problem+json",
    },
    body: JSON.stringify(INVALID_WEBHOOK_SIGNATURE_PROBLEM),
  });
}

export default {
  key: "paymos-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new verified Paymos webhook events. Register this source's HTTP endpoint URL in Paymos Dashboard -> Developer -> Webhooks and paste the generated whsec_ signing secret. [See the documentation](https://paymos.io/docs/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    paymos,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    webhookSecret: {
      type: "string",
      secret: true,
      label: "Webhook Signing Secret (whsec_...)",
      description: "Register this source's HTTP endpoint URL in Paymos Dashboard -> Developer -> Webhooks and paste the generated signing secret, e.g. `whsec_example`.",
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "Optional list of Paymos webhook event types to emit, e.g. `[\"invoice.paid\"]`. Leave empty to emit all 18 canonical Paymos events.",
      optional: true,
      options: [
        ...PAYMOS_CANONICAL_WEBHOOK_EVENTS,
      ],
    },
  },
  methods: {
    getNowSeconds() {
      return Math.floor(Date.now() / 1000);
    },
  },
  async run(event) {
    let secret;
    try {
      secret = validateWebhookSecret(this.webhookSecret);
    } catch {
      respondUnauthorized(this.http);
      return;
    }

    const rawBody = event?.bodyRaw;
    if (
      rawBody === undefined ||
      rawBody === null ||
      (typeof rawBody !== "string" && !Buffer.isBuffer(rawBody)) ||
      (typeof rawBody === "string" && rawBody.length === 0) ||
      (Buffer.isBuffer(rawBody) && rawBody.length === 0)
    ) {
      respondUnauthorized(this.http);
      return;
    }

    const signatureHeader = readSignatureHeader(event?.headers);
    const nowSeconds = typeof this.getNowSeconds === "function"
      ? this.getNowSeconds()
      : Math.floor(Date.now() / 1000);

    let parsed;
    try {
      parsed = parseWebhookEvent(
        rawBody,
        signatureHeader,
        secret,
        DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
        nowSeconds,
      );
    } catch {
      respondUnauthorized(this.http);
      return;
    }

    const selectedEvents = Array.isArray(this.events)
      ? this.events.filter((item) => typeof item === "string" && item.trim() !== "")
      : [];
    const matched = selectedEvents.length === 0 || selectedEvents.includes(parsed.event_type);

    if (!matched) {
      this.http.respond({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          received: true,
          ignored: true,
        }),
      });
      return;
    }

    const seen = await this.db.get(SEEN_EVENT_IDS_KEY);
    const dedup = trackSeenEventId(seen, parsed.event_id, DEFAULT_DEDUP_LIMIT);
    if (dedup.isDuplicate) {
      this.http.respond({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          received: true,
          duplicate: true,
        }),
      });
      return;
    }

    await this.db.set(SEEN_EVENT_IDS_KEY, dedup.seenEventIds);

    this.http.respond({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        received: true,
      }),
    });

    this.$emit(parsed, {
      id: parsed.event_id,
      summary: `${parsed.event_type} (${parsed.event_id})`,
      ts: parsed.occurred_at * 1000,
    });
  },
};
