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
      } = this;
      const {
        resource_id: budgetViewSnapshotId,
        project_id: projectId,
      } = body;

      try {
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
      } catch (error) {
        console.log(error.message || error);
        return body;
      }
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
