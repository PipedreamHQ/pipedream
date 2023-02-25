import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "process_street-workflow-run-created",
  name: "New Workflow Run Created",
  description: "Emit new event for every created workflow run",
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
        .filter((workflowRun) => workflowRun.status === constants.STATUSES.ACTIVE)
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
        constants.WEBHOOK_TYPES.WORKFLOW_RUN_CREATED,
      ];
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New workflow run: ${data.name}`,
        ts: data.audit.createdDate,
      });
    },
  },
};
