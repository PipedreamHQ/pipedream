const common = require("../common.js");

module.exports = {
  ...common,
  name: "New or Updated Prime Contract (Instant)",
  key: "procore-prime-contract",
  description:
    "Emits an event each time a Prime Contract is created, updated, or deleted in a project.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getResourceName() {
      return "Prime Contracts";
    },
    async getDataToEmit(body) {
      const { resource_id: resourceId } = body;
      const resource = await this.procore.getPrimeContract(
        this.company,
        this.project,
        resourceId
      );
      return { body, resource };
    },
    getMeta({ body, resource }) {
      const { title } = resource;
      const { id, event_type: eventType, timestamp } = body;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${title}`,
        ts,
      };
    },
  },
};