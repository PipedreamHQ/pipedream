import { axios } from "@pipedream/platform";
import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-new-order",
  name: "New Order Created",
  description: "Emits an event for each new order created in SevDesk. [See the documentation](https://api.sevdesk.de/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sevdesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    orderDetails: {
      propDefinition: [
        sevdesk,
        "orderDetails",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emitting historical orders not applicable for this source, as it's focused on new orders
    },
  },
  async run() {
    const lastOrderTimestamp = this.db.get("lastOrderTimestamp") || 0;
    const orders = await this.sevdesk.getOrders({
      lastOrderTimestamp,
    });

    orders.forEach((order) => {
      if (new Date(order.create).getTime() > lastOrderTimestamp) {
        this.$emit(order, {
          id: order.id,
          summary: `New Order: ${order.id}`,
          ts: Date.parse(order.create),
        });
        this.db.set("lastOrderTimestamp", new Date(order.create).getTime());
      }
    });
  },
};
