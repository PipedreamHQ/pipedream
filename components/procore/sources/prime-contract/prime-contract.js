const common = require("../common.js");

module.exports = {
  ...common,
  name: "Prime Contract Event(Instant)",
  key: "procore-prime-contract",
  description:
    "Emits an event each time a Prime Contract is created, updated, or deleted in a project.",
  version: "0.0.1",
  type: "source",
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
      const { title } = resource;
      const eventType = event_type;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${title}`,
        ts,
      };
    },
  },
};
