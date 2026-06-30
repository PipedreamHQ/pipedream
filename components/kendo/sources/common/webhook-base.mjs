import kendo from "../../kendo.app.mjs";

export default {
  props: {
    kendo,
    http: {
      type: "$.interface.http",
      customResponse: true,
      label: "Webhook Endpoint",
      description:
        "Pipedream will generate a unique URL below. Copy it into **Integrations > Webhooks > Add Webhook** in your Kendo dashboard.",
    },
    db: {
      type: "$.service.db",
      label: "DB",
      description: "Stores data between executions for deduplication.",
    },
  },
  methods: {
    getEventType() {
      throw new Error("getEventType() must be implemented by the source");
    },
    getSummary() {
      throw new Error("getSummary() must be implemented by the source");
    },
    getEmitPayload(body) {
      const {
        id, event, created_at, data,
      } = body;
      return {
        id,
        event,
        createdAt: created_at,
        ...data,
      };
    },
    _respond(status, body) {
      this.http.respond({
        status,
        body,
      });
    },
    _rejectUnauthorized(reason) {
      console.warn(`${reason} — request rejected.`);
      this._respond(401, {
        error: reason,
      });
    },
  },
  async run(event) {
    const {
      headers, bodyRaw, body,
    } = event;

    const signature = headers["x-kendo-signature"];
    if (!signature) {
      this._rejectUnauthorized("Missing signature");
      return;
    }

    const is_valid = this.kendo.verifyWebhookSignature(bodyRaw, signature);
    if (!is_valid) {
      this._rejectUnauthorized("Invalid signature");
      return;
    }

    this._respond(200, {
      received: true,
    });

    const kendo_event = headers["x-kendo-event"];
    if (kendo_event === "test") {
      console.log("Test delivery received — not emitting.");
      return;
    }

    const expected_event = this.getEventType();
    if (kendo_event !== expected_event) {
      console.log(`Ignoring event type: ${kendo_event}`);
      return;
    }

    const {
      id, created_at, data,
    } = body;
    const payload = this.getEmitPayload(body);

    this.$emit(payload, {
      id,
      summary: this.getSummary(data),
      ts: Date.parse(created_at),
    });
  },
};
