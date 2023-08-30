export default {
  key: "process_street-workflow-run-completed",
  name: "Workflow Run Completed",
  description: "Emit new event for every completed workflow",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    processStreet: {
      type: "app",
      app: "process_street",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the Workflow",
      async options() {
        const { workflows } = await this.listWorkflows();
        return workflows.map((workflow) => ({
          label: workflow.name,
          value: workflow.id,
        }));
      },
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      console.log("Retrieving workflow runs...");
      const { workflowRuns } = await this.processStreet.listWorkflowRuns({
        workflowId: this.workflowId,
      });

      const filteredWorkflowRuns = workflowRuns
        .filter((workflowRun) => workflowRun.status === "Completed")
        .slice(-25);

      for (const workflowRun of filteredWorkflowRuns) {
        this.emitEvent(workflowRun);
      }
    },
    async activate() {
      console.log("Creating webhook...");
      const webhookTypes = this.getWebhookTypes();
      const { id } = await this.processStreet.createWebhook({
        data: {
          url: this.http.endpoint,
          workflowId: this.workflowId,
          triggers: webhookTypes,
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      console.log("Deleting webhook...");
      await this.processStreet.deleteWebhook({
        id: this._getWebhookId(),
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    getWebhookTypes() {
      return [
        "WorkflowRunCompleted",
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
  async run(event) {
    console.log("Webhook received");
    const data = event.body.data;
    this.emitEvent(data);
  },
};
