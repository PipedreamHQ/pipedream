import callingly from "../../callingly.app.mjs";

export default {
  props: {
    callingly,
    db: "$.service.db",
    http: "$.interface.http",
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook",
    },
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    getOtherOpts() {
      return {};
    },
  },
  hooks: {
    async activate() {
      const response = await this.callingly.createHook({
        data: {
          name: this.name,
          event: this.getEvent(),
          target_url: this.http.endpoint,
          ...this.getOtherOpts(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.callingly.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
