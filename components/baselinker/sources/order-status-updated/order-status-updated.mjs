import common from "../common/polling.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "baselinker-order-status-updated",
  name: "Order Status Updated",
  description: "Emit new event when an order status changes in BaseLinker. [See the Documentation](https://api.baselinker.com/index.php?method=getOrderStatusList).",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "logs";
    },
    getResourceFn() {
      return this.app.listJournal;
    },
    getResourceFnArgs() {
      return {
        data: {
          parameters: {
            last_log_id: this.getLastLogId(),
            logs_types: [
              events.ORDER_STATUS_CHANGE,
            ],
          },
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.now();
      return {
        id: `${resource.order_id}-${ts}`,
        summary: `Status Changed: ${resource.order_id}`,
        ts,
      };
    },
    async getResourceByEvent(event) {
      const { orders } = await this.app.listOrders({
        data: {
          parameters: {
            order_id: event.order_id,
            get_unconfirmed_orders: true,
          },
        },
      });
      return orders[0];
    },
  },
};
