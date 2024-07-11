import { axios } from "@pipedream/platform";
import ikas from "../../ikas.app.mjs";

export default {
  key: "ikas-new-product-instant",
  name: "New Product Listed",
  description: "Emit new event when a product is newly listed on ikas. [See the documentation](https://ikas.dev/docs/api/admin-api/webhooks)",
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
      const webhooks = await this.ikas.listWebhooks();
      const productListedWebhooks = webhooks.filter((webhook) => webhook.scope === "store/product/listed");

      for (const webhook of productListedWebhooks.slice(0, 50)) {
        this.$emit(webhook, {
          id: webhook.id,
          summary: `New Product Listed: ${webhook.endpoint}`,
          ts: Date.parse(webhook.createdAt),
        });
      }
    },
    async activate() {
      await this.ikas.createWebhook({
        scopes: "store/product/listed",
        endpoint: this.webhookEndpoint,
      });
    },
    async deactivate() {
      const webhooks = await this.ikas.listWebhooks();
      const productListedWebhooks = webhooks.filter((webhook) => webhook.scope === "store/product/listed");

      for (const webhook of productListedWebhooks) {
        await this.ikas.deleteWebhook({
          webhookId: webhook.id,
        });
      }
    },
  },
  async run(event) {
    const productDetails = event.body;
    this.ikas.emitProductListedEvent(productDetails);
  },
};
