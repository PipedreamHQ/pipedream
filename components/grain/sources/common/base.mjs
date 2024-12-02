import grain from "../../grain.app.mjs";

export default {
  props: {
    grain,
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
  },
  hooks: {
    async activate() {
      const response = await this.grain.createWebhook({
        data: {
          version: 2,
          hook_url: this.http.endpoint,
          view_id: this.viewId,
          actions: this.getAction(),
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.grain.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    if (!body.data) return;

    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.data.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
