import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "process_street-workflow-run-completed",
  name: "Workflow Run Completed",
  description: "Emit new event for every completed workflow",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving workflow runs...");
      const { workflowRuns } = await this.processStreet.listWorkflowRuns({
        workflowId: this.workflowId,
      });

      const filteredWorkflowRuns = workflowRuns
        .filter((workflowRun) => workflowRun.status === constants.STATUSES.COMPLETED)
        .slice(constants.DEPLOY_LIMIT);

      for (const workflowRun of filteredWorkflowRuns) {
        this.emitEvent(workflowRun);
      }
    },
  },
  methods: {
    ...base.methods,
    getWebhookTypes() {
      return [
        constants.WEBHOOK_TYPES.WORKFLOW_RUN_COMPLETED,
      ];
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `Completed workflow run: ${data.name}`,
        ts: data.audit.updatedDate,
      });
    },
  },
};
