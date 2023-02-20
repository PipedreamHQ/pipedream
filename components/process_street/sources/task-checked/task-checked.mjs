import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "process_street-task-checked",
  name: "Task Checked",
  description: "Emit new event when a task is checked",
  type: "source",
  version: "0.0.1",
  props: {
    ...base.props,
    workflowRunId: {
      propDefinition: [
        base.props.processStreet,
        "workflowRunId",
        (c) => ({
          workflowId: c.workflowId,
        }),
      ],
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving checked tasks...");
      const { tasks } = await this.processStreet.listTasks({
        workflowRunId: this.workflowRunId,
      });

      const filteredWorkflowRuns = tasks
        .filter((task) => task.status === constants.WORKFLOW_STATUSES.COMPLETED)
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
        constants.WEBHOOK_TYPES.TASK_CHECKED,
      ];
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `Checked task: ${data.name}`,
        ts: data.updatedDate,
      });
    },
  },
};
