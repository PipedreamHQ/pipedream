import alegra from "../../alegra.app.mjs";

export default {
  props: {
    alegra,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getExtraData() {
      return {};
    },
  },
  hooks: {
    async activate() {
      const { subscription } = await this.alegra.createWebhook({
        data: {
          url: this.http.endpoint.split("https://")[1],
          event: this.getEventType(),
        },
      });
      this._setHookId(subscription.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.alegra.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    if (!body.message) return;

    const ts = Date.parse(new Date());
    const message = body.message;
    const model = message.client || message.item || message.invoice;

    this.$emit(body, {
      id: model.id,
      summary: this.getSummary(message),
      ts: ts,
    });
  },
};
