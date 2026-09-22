import seven from "../../seven.app.mjs";

export default {
  props: {
    seven,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
  },
  hooks: {
    async activate() {
      const response = await this.seven.createHook({
        data: {
          target_url: this.http.endpoint,
          event_type: this.getEventType(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.seven.deleteHook({
        params: {
          webhookId,
        },
      });
    },
  },
  async run({ body }) {
    const ts = body.webhook_timestamp;
    this.$emit(body, {
      id: `${body.data.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
