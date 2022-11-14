const common = require("../common.js");

module.exports = {
  ...common,
  name: "Prime Contract Change Order Event (Instant)",
  key: "procore-prime-contract-change-order",
  description:
    "Emits an event each time a Prime Contract Change Order is created, updated, or deleted in a project.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return "Change Order Packages";
    },
    async getDataToEmit(body) {
      const { resource_id: resourceId } = body;
      const resource = await this.procore.getChangeOrderPackage(
        this.company,
        this.project,
        resourceId,
      );
      return {
        ...body,
        resource,
      };
    },
    getMeta(body) {
      const {
        id,
        event_type: eventType,
        resource_id: resourceId,
        timestamp,
      } = body;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} Change Order ID:${resourceId}`,
        ts,
      };
    },
  },
};
