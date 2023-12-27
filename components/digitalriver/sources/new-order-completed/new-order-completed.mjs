import digitalriver from "../../digitalriver.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "digitalriver-new-order-completed",
  name: "New Order Completed",
  description: "Emit new event when a customer successfully completes an order. [See the documentation](https://docs.digitalriver.com/digital-river-api/order-management/events-and-webhooks-1/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    digitalriver,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhookAddress: {
      propDefinition: [
        digitalriver,
        "webhookAddress",
      ],
    },
    webhookTypes: {
      propDefinition: [
        digitalriver,
        "webhookTypes",
        () => ({
          default: [
            "order.complete",
          ],
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emitting 50 most recent order.complete events
      const events = await this.digitalriver.listCustomers({
        params: {
          eventTypes: [
            "order.complete",
          ],
          limit: 50,
        },
      });
      events.slice(-50).forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: "Order completed",
          ts: Date.parse(event.createdTime),
        });
      });
    },
    async activate() {
      // Creating a webhook for order.complete events
      const webhook = await this.digitalriver.createWebhook({
        address: this.webhookAddress,
        types: this.webhookTypes,
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      // Deleting the webhook
      const webhookId = this.db.get("webhookId");
      await this.digitalriver.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const signature = headers["Digitalriver-Signature"];
    const secret = this.digitalriver.$auth.oauth_access_token;

    if (!this.verifySignature(body, signature, secret)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: "Order completed",
      ts: Date.parse(body.eventTime),
    });

    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
  methods: {
    verifySignature(body, signature, secret) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(body))
        .digest("base64");
      return expectedSignature === signature;
    },
  },
};
