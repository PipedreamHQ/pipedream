export default {
  key: "asana-new-project",
  name: "New Project Added To Workspace (Instant)",
  description: "Emit new event for each new project added to a workspace.",
  version: "0.1.2",
  type: "source",
  dedupe: "unique",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Gid of a workspace.",
    },
  },
  hooks: {
    async activate() {
      const response = await this.asana.createWebHook({
        data: {
          ...this.getWebhookFilter(),
          target: this.http.endpoint,
        },
      });

      this._setWebhookId(response.gid);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.asana.deleteWebhook(webhookId);
    },
  },
  methods: {
    async _respondWebHook(http, event) {
      http.respond({
        status: 200,
        headers: {
          "x-hook-secret": event.headers["x-hook-secret"],
        },
      });
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookFilter() {
      return {
        filters: [
          {
            action: "added",
            resource_type: "project",
          },
        ],
        resource: this.workspace,
      };
    },
    async emitEvent(event) {
      const { body } = event;

      if (!body || !body.events) return;

      for (const e of body.events) {
        const project = await this.asana.getProject(e.resource.gid);

        this.$emit(project, {
          id: project.gid,
          summary: project.name,
          ts: Date.now(),
        });
      }
    },
  },
  async run(event) {
    await this._respondWebHook(this.http, event);

    await this.emitEvent(event);
  },
};
