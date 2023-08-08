export default {
  key: "zenkit-new-notification",
  name: "New Notification (Instant)",
  description: "Emit new event when there is a new notification in Zenkit",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    zenkit: {
      type: "app",
      app: "zenkit",
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const events = await this.getHistoricalEvents({
        limit: 25,
      });
      if (!events) {
        return;
      }
      for (const event of events) {
        this.emitEvent(event);
      }
    },
    async activate() {
      const { id } = await this.zenkit.createWebhook({
        data: {
          triggerType: 2, // notification
          url: this.http.endpoint,
          ...this.getWebhookParams(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.zenkit.deleteWebhook(hookId);
    },
  },
  methods: {
    async getHistoricalEvents(params) {
      return this.zenkit.listNotifications({
        params,
      });
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getTriggerType() {
      return "notification";
    },
    generateMeta(notification) {
      return {
        id: notification.id,
        summary: `New Notification ${notification.id}`,
        ts: Date.parse(notification.updated_at),
      };
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
  },
  async run(event) {
    const { body } = event;
    for (const item of body) {
      this.emitEvent(item);
    }
  },
};
