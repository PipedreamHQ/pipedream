const common = require("../common.js");

module.exports = {
  ...common,
  name: "New or Updated RFI (Instant)",
  key: "procore-rfi",
  description:
    "Emits an event each time a RFI is created, updated, or deleted in a project.",
  version: "0.0.1",
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
        resourceId
      );
      return { body, resource };
    },
    getMeta({ body, resource }) {
      const { subject } = resource;
      const { id, event_type: eventType, timestamp } = body;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${subject}`,
        ts,
      };
    },
  },
};