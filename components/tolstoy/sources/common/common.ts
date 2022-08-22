import tolstoy from "../../app/tolstoy.app";

export default {
  props: {
    tolstoy,
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
    getWebhookEventType() {
      throw new Error("getWebhookEventType is not implemented");
    },
    emitEvent() {
      throw new Error("emitEvent is not implemented");
    },
  },
  hooks: {
    async activate() {
      const response = await this.tolstoy.createWebhook({
        data: {
          url: this.http.endpoint,
          event: this.getWebhookEventType(),
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.tolstoy.removeWebhook(webhookId);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
