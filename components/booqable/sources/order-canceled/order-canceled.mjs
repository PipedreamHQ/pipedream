import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import booqable from "../../booqable.app.mjs";

export default {
  key: "booqable-order-canceled",
  name: "Order Canceled",
  description: "Emits an event when an order changes status to canceled in Booqable.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    booqable,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getOrders() {
      return this.db.get("orders") ?? [];
    },
    _setOrders(orders) {
      this.db.set("orders", orders);
    },
  },
  async run() {
    const orders = await this.booqable.listOrders();
    const oldOrders = this._getOrders();
    const newOrders = [];

    for (const order of orders) {
      const oldOrder = oldOrders.find((o) => o.id === order.id);
      if (oldOrder && oldOrder.status !== "canceled" && order.status === "canceled") {
        this.$emit(order, {
          id: order.id,
          summary: `Order ${order.number} was canceled`,
          ts: Date.parse(order.updated_at),
        });
        newOrders.push(order.id);
      }
    }

    this._setOrders(newOrders);
  },
};
