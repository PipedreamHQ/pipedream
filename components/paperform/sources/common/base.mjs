import paperform from "../../paperform.app.mjs";

export default {
  props: {
    paperform,
    db: "$.service.db",
    http: "$.interface.http",
    formId: {
      propDefinition: [
        paperform,
        "formId",
      ],
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
      const { results: { webhook } } = await this.paperform.createHook({
        formId: this.formId,
        data: {
          target_url: this.http.endpoint,
          triggers: this.getTriggers(),
        },
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.paperform.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.created_at || new Date());
    this.$emit(body, {
      id: body.submission_id || ts,
      summary: this.getSummary(body),
      ts,
    });
  },
};
