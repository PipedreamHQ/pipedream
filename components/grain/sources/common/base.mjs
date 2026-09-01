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
          hook_url: this.http.endpoint,
          hook_type: this.getHookType(),
          include: this.getInclude(),
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.grain.deleteWebhook(webhookId);
      }
    },
  },
  async run({ body }) {
    if (!body.data) return;

    const ts = Date.parse(body.data.end_datetime);
    this.$emit(body, {
      id: body.data.id,
      summary: this.getSummary(body),
      ts: Number.isNaN(ts)
        ? Date.now()
        : ts,
    });
  },
};
