const common = require("../common.js");

module.exports = {
  ...common,
  name: "Budget Snapshot Event (Instant)",
  key: "procore-budget-snapshot",
  description:
    "Emits an event each time a Budget Snapshot is created, updated, or deleted in a project.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return "Budget View Snapshots";
    },
    async getDataToEmit(body) {
      const { resource_id: resourceId } = body;
      const limit = 100;
      let offset = 0;
      let total = limit;
      let snapshotRows = [];
      while (total == limit) {
        const resource = await this.procore.getBudgetViewSnapshot(
          this.company,
          this.project,
          resourceId,
          limit,
          offset,
        );
        snapshotRows = snapshotRows.concat(resource);
        total = resource.length;
        offset += limit;
      }
      return {
        ...body,
        snapshotRows,
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
        summary: `${eventType} Budget Snapshot ID:${resourceId}`,
        ts,
      };
    },
  },
};
