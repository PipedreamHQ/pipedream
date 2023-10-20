const common = require("../common.js");

module.exports = {
  ...common,
  name: "Purchase Order Event (Instant)",
  key: "procore-purchase-order",
  description:
    "Emits an event each time a Purchase Order is created, updated, or deleted in a project.",
  version: "0.0.2",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return "Purchase Order Contracts";
    },
    async getDataToEmit(body) {
      const { resource_id: resourceId } = body;
      const resource = await this.procore.getPurchaseOrder(
        this.company,
        this.project,
        resourceId,
      );
      return {
        ...body,
        resource,
      };
    },
    getMeta({
      id, event_type, timestamp, resource,
    }) {
      const {
        title, id: purchaseOrderId,
      } = resource;
      const eventType = event_type;
      const summary = title
        ? `${eventType} ${title}`
        : `${eventType} Purchase Order ID:${purchaseOrderId}`;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
