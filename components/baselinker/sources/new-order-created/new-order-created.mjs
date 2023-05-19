import common from "../common/polling.mjs";

export default {
  ...common,
  key: "baselinker-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created in BaseLinker. [See the Documentation](https://api.baselinker.com/index.php?method=getOrders).",
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
