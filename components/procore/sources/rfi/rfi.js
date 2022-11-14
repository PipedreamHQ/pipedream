const common = require("../common.js");

module.exports = {
  ...common,
  name: "RFI Event (Instant)",
  key: "procore-rfi",
  description:
    "Emits an event each time a RFI is created, updated, or deleted in a project.",
  version: "0.0.2",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return "RFIs";
    },
    async getDataToEmit(body) {
      const { resource_id: resourceId } = body;
      const resource = await this.procore.getRFI(
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
      const { subject } = resource;
      const eventType = event_type;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${subject}`,
        ts,
      };
    },
  },
};
