import proabono from "../../proabono.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "proabono-new-subscription-event-instant",
  name: "New Subscription Event Instant",
  description: "Emit new event when a change related to a subscription occurs. [See the documentation](https://docs.proabono.com/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    proabono: {
      type: "app",
      app: "proabono",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _computeSignature(body, secret) {
      return crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
    },
  },
  hooks: {
    async activate() {
      // Assuming the creation of the webhook subscription is done elsewhere
      const webhookId = "your_webhook_id"; // Replace with actual webhook ID
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      // Assuming the deletion of the webhook subscription is done elsewhere
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the webhook payload signature
    const computedSignature = this._computeSignature(
      JSON.stringify(body),
      this.proabono.$auth.api_token,
    );
    if (headers["X-ProAbono-Signature"] !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: body.id,
      summary: `New event: ${body.eventType}`,
      ts: Date.parse(body.timestamp),
    });
  },
};
