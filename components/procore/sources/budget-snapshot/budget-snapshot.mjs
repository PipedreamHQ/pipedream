import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Budget Snapshot Event (Instant)",
  key: "procore-budget-snapshot",
  description: "Emit new event each time a Budget Snapshot is created, updated, or deleted in a project.",
  version: "0.1.0",
  type: "source",
  methods: {
    ...common.methods,
    getBudgetViewSnapshot({
      budgetViewSnapshotId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/budget_view_snapshots/${budgetViewSnapshotId}/detail_rows`,
        ...args,
      });
    },
    getResourceName() {
      return constants.RESOURCE_NAMES.BUDGET_VIEW_SNAPSHOTS;
    },
    async getDataToEmit(body) {
      const {
        companyId,
        projectId,
      } = this;
      const { resource_id: resourceId } = body;
      let page = 0;
      let total = constants.DEFAULT_LIMIT;
      let snapshotRows = [];
      while (total === constants.DEFAULT_LIMIT) {
        const resources =
          await this.getBudgetViewSnapshot({
            budgetViewSnapshotId: resourceId,
            headers: this.app.companyHeader(companyId),
            params: {
              per_page: constants.DEFAULT_LIMIT,
              page,
              project_id: projectId,
            },
          });
        snapshotRows = snapshotRows.concat(resources);
        total = resources.length;
        page += 1;
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
