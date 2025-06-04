import beekeeper from "../../beekeeper.app.mjs";

export default {
  props: {
    beekeeper,
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
  },
  hooks: {
    async activate() {
      const response = await this.beekeeper.createWebhook({
        data: {
          callback_url: this.http.endpoint,
          event_type: this.getEventType(),
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.beekeeper.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.notification_id,
      summary: this.getSummary(body),
      ts: Date.now(),
    });
  },
};
