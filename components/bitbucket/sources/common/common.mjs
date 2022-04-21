import bitbucket from "../../bitbucket.app.mjs";

export default {
  props: {
    bitbucket,
    workspaceId: {
      propDefinition: [
        bitbucket,
        "workspace",
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getPath() {
      return `workspaces/${this.workspaceId}/hooks`;
    },
    getWebhookEventTypes() {
      throw new Error("getWebhookEventTypes is not implemented");
    },
    proccessEvent(event) {
      throw new Error("proccessEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const response = await this.bitbucket.createWebhook({
        path: this.getPath(),
        workspaceId: this.workspaceId,
        url: this.http.endpoint,
        events: this.getWebhookEventTypes(),
      });

      this._setWebhookId(response.uuid);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();

      await this.bitbucket.removeWebhook({
        path: this.getPath(),
        webhookId,
      });
    },
  },
  async run(event) {
    this.proccessEvent(event);
  },
};
