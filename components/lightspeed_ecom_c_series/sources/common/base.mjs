import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
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
      const response = await this.app.createHook({
        data: {
          webhook: {
            isActive: true,
            itemGroup: this.getItemGroup(),
            itemAction: this.getItemAction(),
            format: "json",
            address: `${this.http.endpoint}/webhook`,
          },
        },
      });
      this._setWebhookId(response.webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.app.deleteHook(webhookId);
    },
  },
  async run({
    body, headers,
  }) {
    this.http.respond({
      status: 200,
    });

    this.$emit(body, this.generateMeta(body, headers));
  },
};
