import printify from "../../printify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printify-watch-events-instant",
  name: "Watch Events (Instant)",
  description: "Emits an event when a specific event occurs in your Printify shop. [See the documentation](https://developers.printify.com/#events)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    printify,
    db: "$.service.db",
    shopId: {
      propDefinition: [
        printify,
        "shopId",
      ],
    },
    topic: {
      propDefinition: [
        printify,
        "topic",
      ],
    },
    webhookUrl: {
      propDefinition: [
        printify,
        "webhookUrl",
        (c) => ({
          shopId: c.shopId,
        }),
      ],
    },
    webhookSecret: {
      propDefinition: [
        printify,
        "webhookSecret",
        (c) => ({
          shopId: c.shopId,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // Register webhook
      const webhook = await this.printify.createWebhook({
        shopId: this.shopId,
        topic: this.topic,
        url: this.webhookUrl,
        secret: this.webhookSecret,
      });
      this.db.set("webhookId", webhook.id);
    },
    async activate() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) {
        throw new Error("No webhook ID stored. Please redeploy this source.");
      }
      // Check if the registered webhook exists
      const webhooks = await this.printify.listWebhooks({
        shopId: this.shopId,
      });
      const currentWebhook = webhooks.find((webhook) => webhook.id === webhookId);
      if (!currentWebhook) {
        throw new Error("Webhook not found. It may have been deleted externally.");
      }
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.printify.deleteWebhook({
          shopId: this.shopId,
          webhookId,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New event for topic ${event.body.topic}`,
      ts: Date.parse(event.body.created_at),
    });
  },
};
