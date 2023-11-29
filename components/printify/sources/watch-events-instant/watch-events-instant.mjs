import { randomUUID } from "crypto";
import { secureCompare } from "../../common/utils.mjs";
import printify from "../../printify.app.mjs";

export default {
  key: "printify-watch-events-instant",
  name: "New Watched Event (Instant)",
  description: "Emit new event when a specific event occurs in your Printify shop.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    printify,
    db: "$.service.db",
    http: "$.interface.http",
    shopId: {
      propDefinition: [
        printify,
        "shopId",
      ],
    },
    topic: {
      type: "string",
      label: "Webhook Topic",
      description: "The event that triggers the webhook.",
      async options() {
        return [
          {
            label: "Shop Disconnected",
            value: "shop:disconnected",
          },
          {
            label: "Product Deleted",
            value: "product:deleted",
          },
          {
            label: "Product Publish Started",
            value: "product:publish:started",
          },
          {
            label: "Order Created",
            value: "order:created",
          },
          {
            label: "Order Updated",
            value: "order:updated",
          },
          {
            label: "Order Sent to Production",
            value: "order:sent-to-production",
          },
          {
            label: "Order Shipment Created",
            value: "order:shipment:created",
          },
          {
            label: "Order Shipment Delivered",
            value: "order:shipment:delivered",
          },
        ];
      },
    },
  },
  hooks: {
    async activate() {
      const uuid = randomUUID();
      const webhook = await this.printify.createHook({
        shopId: this.shopId,
        data: {
          topic: this.topic,
          url: this.http.endpoint,
          secret: uuid,
        },
      });
      this.db.set("webhookId", webhook.id);
      this.db.set("uuid", uuid);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.printify.deleteHook({
        shopId: this.shopId,
        webhookId,
      });
    },
  },
  async run(event) {
    const uuid = this.db.get("uuid");
    if (!secureCompare(event.headers["x-pfy-signature"], event, uuid)) {
      return false;
    }

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New event for topic ${event.body.type}`,
      ts: Date.parse(event.body.created_at),
    });
  },
};
