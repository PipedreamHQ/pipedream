import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New Budget Snapshot Event (Instant)",
  key: "procore-new-budget-snapshot-event-instant",
  description: "Emit new event when a new budget snapshot event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.BUDGET_VIEW_SNAPSHOTS;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
        projectId,
      } = this;
      const { resource_id: budgetViewSnapshotId } = body;

      if (!projectId) {
        console.log("If you need to get more details about the budget snapshot, please provide a project ID.");
        return body;
      }

      const snapshotRows = await app.paginate({
        resourcesFn: app.getBudgetViewSnapshot,
        resourcesFnArgs: {
          companyId,
          budgetViewSnapshotId,
          params: {
            project_id: projectId,
          },
        },
      });

      return {
        ...body,
        snapshotRows,
      };
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Budget Snapshot Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};
