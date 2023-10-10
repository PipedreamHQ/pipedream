import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import booqable from "../../booqable.app.mjs";

export default {
  key: "booqable-order-canceled",
  name: "Order Canceled",
  description: "Emits an event when an order changes status to canceled",
  version: "0.0.{{ts}}",
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
    _getOrderStatuses() {
      return this.db.get("orderStatuses") || {};
    },
    _setOrderStatuses(orderStatuses) {
      this.db.set("orderStatuses", orderStatuses);
    },
  },
  async run() {
    const orderStatuses = this._getOrderStatuses();
    const { orders } = await this.booqable.listOrders();

    for (const order of orders) {
      const oldStatus = orderStatuses[order.id];
      const newStatus = order.status;

      if (oldStatus !== newStatus) {
        orderStatuses[order.id] = newStatus;

        if (newStatus === "canceled") {
          this.$emit(order, {
            id: order.id,
            summary: `Order ${order.number} was canceled`,
            ts: Date.now(),
          });
        }
      }
    }
    this._setOrderStatuses(orderStatuses);
  },
};
