import digitalriver from "../../digitalriver.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "digitalriver-new-payment-status-updated",
  name: "New Payment Status Updated",
  description: "Emits an event each time the payment status of an order is updated in Digital River. [See the documentation](https://www.digitalriver.com/docs/digital-river-api-reference/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    digitalriver: {
      type: "app",
      app: "digitalriver",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
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
        (c) => ({
          default: [
            "order.pending_payment",
            "order.charge.*",
          ],
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the 50 most recent payment status updated events
      // Since an endpoint for fetching historical events is not provided, this is a placeholder
    },
    async activate() {
      const { id: webhookId } = await this.digitalriver.createWebhook({
        address: this.webhookAddress,
        types: this.webhookTypes,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.digitalriver.deleteWebhook(webhookId);
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const secret = this.digitalriver.$auth.oauth_access_token;
    const signature = headers["x-digitalriver-signature"];
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Signature mismatch",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "Webhook received",
    });

    this.$emit(body, {
      id: body.id || `${body.type}-${Date.now()}`,
      summary: `Payment status updated for order ${body.id}`,
      ts: Date.parse(body.created_at) || Date.now(),
    });
  },
};
