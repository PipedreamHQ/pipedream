import common from "../common/polling.mjs";

export default {
  ...common,
  key: "retriever-new-device-return-order",
  name: "New Device Return Order",
  description: "Triggers when a new device return order is created. [See the documentation](https://app.helloretriever.com/api/v1/docs/#tag/Device-Return-Orders/operation/List%20Orders)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "results";
    },
    getResourceFn() {
      return this.app.listOrders;
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
