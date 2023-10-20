import asana from "../../asana.app.mjs";

export default {
  props: {
    asana,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspace: {
      label: "Workspace",
      description: "Gid of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
      optional: true,
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
      throw new Error("getWebhookFilter is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
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
  async run(event) {
    await this._respondWebHook(this.http, event);

    await this.emitEvent(event);
  },
};
