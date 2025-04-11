import zohoBooks from "../../zoho_books.app.mjs";

export default {
  props: {
    zohoBooks,
    http: "$.interface.http",
    db: "$.service.db",
    webhookName: {
      type: "string",
      label: "Webhook Name",
      description: "A name to identify the webhook.",
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const { webhook } = await this.zohoBooks.createWebhook({
        data: {
          webhook_name: this.webhookName,
          url: this.http.endpoint,
          entity: this.getEntity(),
          method: "POST",
          body_type: "application/json",
          raw_data: "${JSONString}",
        },
      });
      this._setHookId(webhook.webhook_id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.zohoBooks.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    if (body.payload === "") return true;
    this.$emit(body, this.generateMeta(body));
  },
};
