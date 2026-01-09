import sender from "../../sender.app.mjs";

export default {
  props: {
    sender,
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
    getExtraData() {
      return {};
    },
  },
  hooks: {
    async activate() {
      const response = await this.sender.createHook({
        data: {
          url: this.http.endpoint,
          topic: this.getTopic(),
          ...this.getExtraData(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.sender.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    const ts = body.created;
    this.$emit(body, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
