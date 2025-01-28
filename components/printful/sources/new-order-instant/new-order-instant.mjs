import printful from "../../printful.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printful-new-order-instant",
  name: "New Order Instant",
  description: "Emit new event when a new order is created in your Printful account. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    printful: {
      type: "app",
      app: "printful",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    orderStatusFilter: {
      propDefinition: [
        printful,
        "orderStatusFilter",
      ],
      optional: true,
    },
    fulfillmentLocationFilter: {
      propDefinition: [
        printful,
        "fulfillmentLocationFilter",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      try {
        const webhookUrl = this.http.url;
        const payload = {
          url: webhookUrl,
          events: [
            "order.created",
          ],
        };
        const response = await this.printful._makeRequest({
          method: "POST",
          path: "/webhooks",
          data: payload,
        });
        const webhookId = response.id;
        await this.db.set("webhookId", webhookId);
      } catch (error) {
        throw new Error(`Failed to activate webhook: ${error.message}`);
      }
    },
    async deactivate() {
      try {
        const webhookId = await this.db.get("webhookId");
        if (webhookId) {
          await this.printful._makeRequest({
            method: "DELETE",
            path: `/webhooks/${webhookId}`,
          });
          await this.db.set("webhookId", null);
        }
      } catch (error) {
        throw new Error(`Failed to deactivate webhook: ${error.message}`);
      }
    },
    async deploy() {
      try {
        const orders = await this.printful.listOrders({
          params: {
            limit: 50,
            sort: "desc",
          },
        });
        for (const order of orders.result) {
          this.$emit(
            order,
            {
              id: order.id.toString(),
              summary: `New order: ${order.id}`,
              ts: Date.parse(order.created_at) || Date.now(),
            },
          );
        }
      } catch (error) {
        throw new Error(`Failed to deploy hook: ${error.message}`);
      }
    },
  },
  async run(event) {
    const order = event.body;
    let shouldEmit = true;

    if (this.orderStatusFilter) {
      shouldEmit = shouldEmit && order.status === this.orderStatusFilter;
    }

    if (this.fulfillmentLocationFilter) {
      shouldEmit = shouldEmit && order.fulfillment_location_id === this.fulfillmentLocationFilter;
    }

    if (shouldEmit) {
      this.$emit(
        order,
        {
          id: order.id.toString(),
          summary: `New order: ${order.id}`,
          ts: Date.parse(order.created_at) || Date.now(),
        },
      );
    }
  },
};
