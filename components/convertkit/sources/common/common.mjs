import convertkit from "../../convertkit.app.mjs";

export default {
  props: {
    convertkit,
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
    processEvent(event) {
      throw new Error("processEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const event = this.getWebhookEventTypes();
      const { rule } = await this.convertkit.createWebhook({
        target_url: this.http.endpoint,
        event,
      });
      this._setWebhookId(rule.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      return await this.convertkit.removeWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    this.processEvent(event);
  },
};
