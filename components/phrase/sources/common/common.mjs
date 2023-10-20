import phrase from "../../phrase.app.mjs";

export default {
  props: {
    phrase,
    db: "$.service.db",
    http: "$.interface.http",
    projectId: {
      propDefinition: [
        phrase,
        "projectId",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEventType() {
      throw new Error("getWebhookEventType is not implemented");
    },
    getBodyKey() {
      throw new Error("getBodyKey is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const response = await this.phrase.createWebhook({
        projectId: this.projectId,
        data: {
          callback_url: this.http.endpoint,
          events: this.getWebhookEventType(),
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.phrase.removeWebhook({
        projectId: this.projectId,
        webhookId,
      });
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
