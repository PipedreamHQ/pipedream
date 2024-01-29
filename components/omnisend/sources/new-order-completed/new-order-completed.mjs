import { axios } from "@pipedream/platform";
import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-new-order-completed",
  name: "New Order Completed",
  description: "Emits an event for each new completed order in Omnisend. [See the documentation](https://www.omnisend.com/developers)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    omnisend,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the last 50 orders (if available) on the first run
      const latestOrders = await this.omnisend.listOrders({
        limit: 50,
      });
      latestOrders.orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50)
        .forEach((order) => {
          this.$emit(order, {
            id: order.orderID,
            summary: `New Order: ${order.orderID}`,
            ts: Date.parse(order.createdAt),
          });
        });
    },
  },
  methods: {
    ...omnisend.methods,
  },
  async run() {
    // Retrieve the last processed order ID from the DB
    const lastProcessedOrderId = this.db.get("lastProcessedOrderId") || null;
    let newLastProcessedOrderId = lastProcessedOrderId;
    let hasMore = true;
    let offset = 0;

    while (hasMore) {
      const response = await this.omnisend.listOrders({
        offset,
      });
      const { orders } = response;
      if (orders.length === 0) {
        hasMore = false;
        continue;
      }

      orders.forEach((order) => {
        if (lastProcessedOrderId && order.orderID <= lastProcessedOrderId) {
          // We've processed this order already, skip
          return;
        }

        if (!newLastProcessedOrderId || order.orderID > newLastProcessedOrderId) {
          // We've found a new latest order, update the state
          newLastProcessedOrderId = order.orderID;
        }

        this.$emit(order, {
          id: order.orderID,
          summary: `New Order: ${order.orderID}`,
          ts: Date.parse(order.createdAt),
        });
      });

      if (orders.length < 100) {
        // No more orders are available
        hasMore = false;
      } else {
        // Prepare to fetch the next page
        offset += orders.length;
      }
    }

    // Save the ID of the latest order processed
    if (newLastProcessedOrderId) {
      this.db.set("lastProcessedOrderId", newLastProcessedOrderId);
    }
  },
};
