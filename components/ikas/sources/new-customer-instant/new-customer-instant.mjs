import ikas from "../../ikas.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ikas-new-customer-instant",
  name: "New Customer Instant",
  description: "Emit new event when a customer account is newly created on ikas. [See the documentation](https://ikas.dev/docs/api/admin-api/webhooks)",
  version: "0.0.1",
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
      const webhooks = await this.ikas.listWebhooks();
      const customerCreatedWebhooks = webhooks.filter((webhook) => webhook.scope === "store/customer/created");

      for (const webhook of customerCreatedWebhooks.slice(0, 50)) {
        this.$emit(webhook, {
          id: webhook.id,
          summary: `New webhook for customer created: ${webhook.endpoint}`,
          ts: webhook.createdAt,
        });
      }
    },
    async activate() {
      const response = await this.ikas.createWebhook({
        scopes: "store/customer/created",
        endpoint: this.webhookEndpoint,
      });
      const webhook = response.saveWebhook[0];
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.ikas.deleteWebhook({
          webhookId,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    if (event.body && event.body.scope === "store/customer/created") {
      const customerDetails = event.body.data;
      await this.ikas.emitCustomerCreatedEvent(customerDetails);
    }
  },
};
