const common = require("../common.js");

module.exports = {
  ...common,
  name: "New or Updated Purchase Order (Instant)",
  key: "procore-purchase-order",
  description:
    "Emits an event each time a Purchase Order is created, updated, or deleted in a project.",
  version: "0.0.1",
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
        resourceId
      );
      return { body, resource };
    },
    getMeta({ body, resource }) {
      const { title, id: purchaseOrderId } = resource;
      const { id, event_type: eventType, timestamp } = body;
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