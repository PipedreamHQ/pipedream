import yotpo from '../../yotpo.app.mjs'

export default {
  props: {
    yotpo,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    getWebhookEventType() {
      throw new Error("getWebhookEventType is not implemented");
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    }
  },
  hooks: {
    async activate() {
      const response = await this.awork.createWebhook({
        data: {
          url: this.http.endpoint,
          event_name: this.getWebhookEventType(),
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.awork.removeWebhook(webhookId);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
}
