import common from "../common/polling.mjs";

export default {
  ...common,
  key: "retrieval-new-device-return-order",
  name: "New Device Return Order",
  description: "Triggers when a new device return order is created. [See the documentation](https://www.remoteretrieval.com/api-documentation/#all-orders)",
  type: "source",
  version: "0.1.0",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "results";
    },
    getResourceFn() {
      return this.app.allOrders;
    },
    getResourceFnArgs() {
      return;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Order: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
