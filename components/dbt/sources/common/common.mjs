import dbt from "../../dbt.app.mjs";

export default {
  props: {
    dbt,
    db: "$.service.db",
    http: "$.interface.http",
    accountId: {
      propDefinition: [
        dbt,
        "accountId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.dbt.createWebhook({
        accountId: this.accountId,
        data: {
          event_types: this.getEventTypes(),
          name: "Pipedream Webhook",
          client_url: this.http.endpoint,
          active: true,
        },
      });
      if (!data?.id) {
        throw new Error("Webhook creation failed");
      }
      this._setWebhookId(data.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.dbt.deleteWebhook({
        accountId: this.accountId,
        webhookId,
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
