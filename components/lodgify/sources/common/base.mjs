import lodgify from "../../lodgify.app.mjs";

export default {
  props: {
    lodgify,
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
    _getWebhookSecret() {
      return this.db.get("webhookSecret");
    },
    _setWebhookSecret(secret) {
      this.db.set("webhookSecret", secret);
    },
  },
  hooks: {
    async activate() {
      const response = await this.lodgify.createHook({
        data: {
          target_url: this.http.endpoint,
          event: this.getEvent(),
        },
      });
      this._setWebhookId(response.id);
      this._setWebhookSecret(response.secret);
    },
    async deactivate() {
      await this.lodgify.deleteHook({
        data: {
          id: this._getWebhookId(),
        },
      });
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
