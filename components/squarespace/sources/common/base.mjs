import squarespace from "../../squarespace.app.mjs";

export default {
  props: {
    squarespace,
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
    getWebhookEventTypes() {
      throw new Error("getWebhookEventTypes is not implemented");
    },
  },
  hooks: {
    async activate() {
      const response = await this.squarespace.createWebhook({
        endpointUrl: this.http.endpoint,
        topics: this.getWebhookEventTypes(),
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.squarespace.removeWebhook(webhookId);
    },
  },
};
