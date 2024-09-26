import kadoa from "../../kadoa.app.mjs";

export default {
  key: "kadoa-new-workflow-finished-instant",
  name: "New Workflow Finished (Instant)",
  description: "Emit new event when a Kadoa workflow finishes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    kadoa,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { id } = await this.kadoa.createWebhook({
        data: {
          webhookUrl: this.http.endpoint,
          webhookHttpMethod: "GET",
          events: [
            "workflow_finished",
          ],
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.kadoa.deleteWebhook(hookId);
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.jobId,
      summary: `Workflow ${body.workflowId} run finished`,
      ts: Date.parse(body.finishedAt) || +new Date(),
    });
  },
};
