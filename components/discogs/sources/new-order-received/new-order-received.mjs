import discogs from "../../discogs.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "discogs-new-order-received",
  name: "New Order Received",
  description: "Emits an event when there is an order with status 'New Order'. [See the documentation](https://www.discogs.com/developers#page:marketplace,header:marketplace-list-orders)",
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
      return this.db.get("lastOrderId") || 0;
    },
    _setLastOrderId(orderId) {
      this.db.set("lastOrderId", orderId);
    },
  },
  hooks: {
    async deploy() {
      let page = 1;
      let maxOrders = 50;
      let newOrders = [];

      while (maxOrders > 0) {
        const { orders } = await this.discogs.listOrders({
          page,
        });
        const filteredOrders = orders.filter((order) => order.status === "New Order");
        newOrders.push(...filteredOrders);
        if (filteredOrders.length < maxOrders) {
          maxOrders -= filteredOrders.length;
        } else {
          break;
        }
        page++;
      }

      newOrders.slice(-50).forEach((order) => {
        this.$emit(order, {
          id: order.id,
          summary: `New Order Received: ${order.id}`,
          ts: Date.parse(order.created),
        });
      });

      if (newOrders.length > 0) {
        this._setLastOrderId(newOrders[0].id);
      }
    },
  },
  async run() {
    const lastOrderId = this._getLastOrderId();
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const {
        orders, pagination,
      } = await this.discogs.listOrders({
        page,
      });

      const newOrders = orders
        .filter((order) => order.status === "New Order" && order.id > lastOrderId);

      newOrders.forEach((order) => {
        this.$emit(order, {
          id: order.id,
          summary: `New Order: ${order.id}`,
          ts: Date.parse(order.created),
        });
      });

      if (newOrders.length > 0) {
        this._setLastOrderId(newOrders[0].id);
      }

      hasMore = pagination.urls.next !== undefined;
      page++;
    }
  },
};
