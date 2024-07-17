import _1crm from "../../_1crm.app.mjs";

export default {
  props: {
    _1crm,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("webhookId", hookId);
    },
    _getHookId() {
      return this.db.get("webhookId");
    },
  },
  hooks: {
    async activate() {
      const data = await this._1crm.createWebhook({
        data: {
          type: "create_update",
          url: this.http.endpoint,
          model: this.getModel(),
        },
      });
      this._setHookId(data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this._1crm.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.resource}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
