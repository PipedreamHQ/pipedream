import app from "../../paypal.app.mjs";

export default {
  props: {
    app,
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
      throw new Error("getWebhookEventType is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async deploy() {
      const { events } = await this.app.getWebhooksEvents({
        page_size: 10,
        event_type: this.getWebhookEventTypes()[0].name,
      });

      events.map(this.emitEvent);
    },
    async activate() {
      const response = await this.app.createWebhook({
        data: {
          url: this.http.endpoint,
          event_types: this.getWebhookEventTypes(),
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.app.removeWebhook(webhookId);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
