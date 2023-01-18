import accelo from "../../accelo.app.mjs";

export default {
  props: {
    accelo,
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
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    deploy(event) {
      throw new Error("deploy is not implemented", event);
    },
  },
  hooks: {
    async deploy() {
      await this.deploy();
    },
    async activate() {
      const { response } = await this.accelo.createWebhook({
        data: {
          trigger_url: this.http.endpoint,
          event_id: this.getWebhookEventType(),
        },
      });

      this._setWebhookId(response.subscription.subscription_id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.accelo.removeWebhook(webhookId);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
