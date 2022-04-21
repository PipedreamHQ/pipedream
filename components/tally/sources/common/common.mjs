import tally from "../../tally.app.mjs";

export default {
  props: {
    tally,
    formId: {
      propDefinition: [
        tally,
        "form",
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
    getWebhookEventTypes() {
      throw new Error("getWebhookEventTypes is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const response = await this.tally.createWebhook({
        formId: this.formId,
        url: this.http.endpoint,
        eventTypes: this.getWebhookEventTypes(),
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.tally.removeWebhook(webhookId);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
