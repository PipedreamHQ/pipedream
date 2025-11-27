import encharge from "../../encharge.app.mjs";

export default {
  props: {
    encharge,
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
      const { subscription } = await this.encharge.createHook({
        data: {
          url: this.http.endpoint,
          eventType: this.getEvent(),
        },
      });
      this._setWebhookId(subscription.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.encharge.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
