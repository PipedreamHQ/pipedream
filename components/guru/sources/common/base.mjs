import guru from "../../guru.app.mjs";

export default {
  props: {
    guru,
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
    getExtraData() {
      return {};
    },
  },
  hooks: {
    async activate() {
      const response = await this.guru.createWebhook({
        data: {
          targetUrl: this.http.endpoint,
          deliveryMode: "SINGLE",
          status: "ENABLED",
          filter: this.getEventType(),
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.guru.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: Date.parse(body.eventDate),
    });
  },
};
