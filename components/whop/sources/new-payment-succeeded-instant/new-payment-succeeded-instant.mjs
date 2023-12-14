import whop from "../../whop.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "whop-new-payment-succeeded-instant",
  name: "New Payment Succeeded (Instant)",
  description: "Emit new event when your company receives a successful payment. [See the documentation](https://dev.whop.com/api-reference/v2/webhooks/create-a-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whop,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    transactionDetails: {
      propDefinition: [
        whop,
        "transactionDetails",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    generateSignature(secret, body) {
      return crypto
        .createHmac("sha256", secret)
        .update(body, "utf8")
        .digest("hex");
    },
    verifyWebhookSignature(secret, signature, body) {
      const expectedSignature = this.generateSignature(secret, body);
      return expectedSignature === signature;
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent successful payment events
      // Since the API does not provide a way to fetch historical payment events,
      // we assume this is the initial deployment and there are no historical events to emit.
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const events = [
        "payment_succeeded",
      ];
      const { id } = await this.whop._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          enabled: true,
          events,
          url: webhookUrl,
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.whop._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this._setWebhookId(null);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const signature = headers["x-whop-signature"];
    const secret = this.whop.$auth.oauth_access_token;

    if (signature && !this.verifyWebhookSignature(secret, signature, body)) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    const transactionDetails = JSON.parse(body);
    this.$emit(transactionDetails, {
      id: transactionDetails.id,
      summary: `Payment succeeded: ${transactionDetails.amount} via ${transactionDetails.method}`,
      ts: Date.parse(transactionDetails.created_at),
    });

    this.http.respond({
      status: 200,
      body: "Webhook processed",
    });
  },
};
