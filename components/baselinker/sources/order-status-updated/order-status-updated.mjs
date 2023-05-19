import common from "../common/polling.mjs";

export default {
  ...common,
  key: "baselinker-order-status-updated",
  name: "Order Status Updated",
  description: "Emit new event when an order status changes in BaseLinker. [See the Documentation](https://api.baselinker.com/index.php?method=getOrderStatusList).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "resource";
    },
    getResourceFn() {
      return this.app.listResources;
    },
    getResourceFnArgs() {
      return {};
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
