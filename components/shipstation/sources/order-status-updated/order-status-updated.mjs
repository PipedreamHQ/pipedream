import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import shipstation from "../../shipstation.app.mjs";

export default {
  key: "shipstation-order-status-updated",
  name: "Order Status Updated",
  description: "Emit new event when an order's status changes. [See the documentation](https://docs.shipstation.com/apis/shipstation-v1/openapi/orders/list_orders)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    shipstation,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    storeId: {
      propDefinition: [
        shipstation,
        "storeId",
      ],
      optional: true,
    },
  },
  methods: {
    _getOrderStatuses() {
      return this.db.get("orderStatuses") || {};
    },
    _setOrderStatuses(statuses) {
      this.db.set("orderStatuses", statuses);
    },
    _ninetyDaysAgo() {
      const date = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      return date.toISOString().replace(/(\.\d{3})Z$/, "$10000");
    },
    async fetchAllOrders() {
      const orders = [];
      let page = 1;
      let pages;

      do {
        const response = await this.shipstation.listOrders({
          params: {
            // limit to orders created in the last 90 days so as not to overwhelm the system
            createDateStart: this._ninetyDaysAgo(),
            storeId: this.storeId,
            sortBy: "ModifyDate",
            sortDir: "DESC",
            page,
            pageSize: 500,
          },
        });
        orders.push(...response.orders ?? []);
        pages = response.pages;
        page++;
      } while (page <= pages);

      return orders;
    },
    generateMeta(order, previousStatus) {
      return {
        id: `${order.orderId}-${order.modifyDate}`,
        summary: `Order ${order.orderNumber}: ${previousStatus} → ${order.orderStatus}`,
        ts: Date.parse(order.modifyDate),
      };
    },
  },
  async run() {
    const orders = await this.fetchAllOrders();
    const statuses = this._getOrderStatuses();

    for (const order of orders) {
      const previousStatus = statuses[order.orderId];

      if (previousStatus === undefined) {
        // First time seeing this order — record its status but don't emit.
        statuses[order.orderId] = order.orderStatus;
      } else if (previousStatus !== order.orderStatus) {
        this.$emit(order, this.generateMeta(order, previousStatus));
        statuses[order.orderId] = order.orderStatus;
      }
    }

    this._setOrderStatuses(statuses);
  },
};
