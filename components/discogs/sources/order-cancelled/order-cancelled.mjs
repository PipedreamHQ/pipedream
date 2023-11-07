import discogs from "../../discogs.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "discogs-order-cancelled",
  name: "Order Cancelled",
  description: "Emits an event when an order status changes to 'Cancelled'. [See the documentation](https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    discogs,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastOrderId() {
      return this.db.get("lastOrderId") ?? null;
    },
    _setLastOrderId(orderId) {
      this.db.set("lastOrderId", orderId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch orders to backfill
      let page = 1;
      let lastOrderId = this._getLastOrderId();
      const orders = [];

      while (true) {
        const response = await this.discogs.listOrders({
          page,
        });
        const {
          orders: fetchedOrders, pagination,
        } = response;
        const cancelledOrders = fetchedOrders.filter((order) => order.status === "Cancelled");

        for (const order of cancelledOrders) {
          if (!lastOrderId || order.id > lastOrderId) {
            this.$emit(order, {
              id: order.id,
              summary: `Order ${order.id} is cancelled`,
              ts: Date.parse(order.created),
            });
            lastOrderId = order.id; // Update last emitted order id
          }
        }

        if (pagination.pages === page || fetchedOrders.length === 0) break;
        page++;
      }

      this._setLastOrderId(lastOrderId);
    },
  },
  async run() {
    // Fetch new orders to check for cancellations
    let page = 1;
    let lastOrderId = this._getLastOrderId();

    while (true) {
      const response = await this.discogs.listOrders({
        page,
      });
      const {
        orders: fetchedOrders, pagination,
      } = response;
      const newCancelledOrders = fetchedOrders.filter((order) => order.status === "Cancelled");

      for (const order of newCancelledOrders) {
        if (!lastOrderId || order.id > lastOrderId) {
          this.$emit(order, {
            id: order.id,
            summary: `Order ${order.id} is cancelled`,
            ts: Date.parse(order.created),
          });
          lastOrderId = order.id; // Update last emitted order id
        }
      }

      if (pagination.pages === page || fetchedOrders.length === 0) break;
      page++;
    }

    this._setLastOrderId(lastOrderId);
  },
};
