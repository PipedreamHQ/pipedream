import grain from "../../grain.app.mjs";

export default {
  props: {
    grain,
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
    getInclude() {
      return undefined;
    },
    getTimestamp() {
      return Date.now();
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
    this.http.respond({
      status: 200,
    });

    if (!body?.data?.id || body.type !== this.getHookType()) return;

    this.$emit(body, {
      id: body.data.id,
      summary: this.getSummary(body),
      ts: this.getTimestamp(body),
    });
  },
};
