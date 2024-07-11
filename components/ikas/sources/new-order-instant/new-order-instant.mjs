import { axios } from "@pipedream/platform";
import ikas from "../../ikas.app.mjs";

export default {
  key: "ikas-new-order-instant",
  name: "New Order Placed",
  description: "Emit new event when a new order is placed on ikas. [See the documentation](https://ikas.dev/docs/api/admin-api/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ikas,
    db: "$.service.db",
    webhookEndpoint: {
      propDefinition: [
        ikas,
        "webhookEndpoint",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { listWebhook } = await this.ikas.listWebhooks();
      for (const webhook of listWebhook) {
        if (webhook.scope === "store/order/created") {
          this.db.set("webhookId", webhook.id);
          break;
        }
      }
    },
    async activate() {
      const response = await this.ikas.createWebhook({
        scopes: "store/order/created",
        endpoint: this.webhookEndpoint,
      });
      this.db.set("webhookId", response.saveWebhook[0].id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.ikas.deleteWebhook({
          webhookId,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const orderDetails = event.body;
    this.ikas.emitOrderPlacedEvent(orderDetails);
  },
};
