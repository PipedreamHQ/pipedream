import fibery from "../../fibery.app.mjs";

export default {
  props: {
    fibery,
    db: "$.service.db",
    http: "$.interface.http",
    type: {
      propDefinition: [
        fibery,
        "type",
      ],
    },
  },
  hooks: {
    async deploy() {},
    async activate() {
      const response = await this.fibery.createWebhook({
        data: {
          url: this.http.endpoint,
          type: this.type,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.fibery.deleteWebhook({
        webhookId,
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
};
