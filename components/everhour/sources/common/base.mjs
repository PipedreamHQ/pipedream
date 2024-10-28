import everhour from "../../everhour.app.mjs";

export default {
  props: {
    everhour,
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
      const response = await this.everhour.createWebhook({
        data: {
          targetUrl: this.http.endpoint,
          events: this.getEventType(),
          ...this.getExtraData(),
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.everhour.deleteWebhook(webhookId);
    },
  },
  async run({
    body, headers,
  }) {
    if (headers["x-hook-secret"]) {
      return this.http.respond({
        status: 200,
        headers: {
          "X-Hook-Secret": headers["x-hook-secret"],
        },
      });
    }

    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.resource}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
