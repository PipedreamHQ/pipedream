import laposta from "../../laposta.app.mjs";

export default {
  props: {
    laposta,
    db: "$.service.db",
    http: "$.interface.http",
    listId: {
      propDefinition: [
        laposta,
        "listId",
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
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const response = await this.laposta.createWebhook({
        data: {
          list_id: this.listId,
          url: this.http.endpoint,
          event: this.getWebhookEventType(),
          blocked: "false",
        },
      });

      this._setWebhookId(response.webhook.webhook_id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.laposta.removeWebhook({
        webhookId,
        params: {
          list_id: this.listId,
        },
      });
    },
  },
  async run(event) {
    event.body.data.forEach(({ data }) => this.emitEvent(data));
  },
};
