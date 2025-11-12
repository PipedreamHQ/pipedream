import common from "../common/polling.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "baselinker-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created in BaseLinker. [See the Documentation](https://api.baselinker.com/index.php?method=getOrders).",
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
              events.ORDER_CREATION,
            ],
          },
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.order_id,
        summary: `New Order: ${resource.order_id}`,
        ts: Date.now(),
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
