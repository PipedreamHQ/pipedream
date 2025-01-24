import app from "../../invoice_ninja.app.mjs";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
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
      const { data } = await this.app.createWebhook({
        data: {
          target_url: this.http.endpoint,
          event_id: this.getEvent(),
          format: "JSON",
        },
      });

      this._setHookId(data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.app.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: body.created_at,
    });
  },
};
