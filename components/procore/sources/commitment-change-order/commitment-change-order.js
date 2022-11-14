const common = require("../common.js");

module.exports = {
  ...common,
  name: "Commitment Change Order Event (Instant)",
  key: "procore-commitment-change-order",
  description:
    "Emits an event each time a Commitment Change Order is created, updated, or deleted in a project.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return "Change Events";
    },
    async getDataToEmit(body) {
      const { resource_id: resourceId } = body;
      const resource = await this.procore.getChangeEvent(
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
