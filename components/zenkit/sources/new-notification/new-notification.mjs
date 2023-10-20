import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-new-notification",
  name: "New Notification (Instant)",
  description: "Emit new event when there is a new notification in Zenkit",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(params) {
      return this.zenkit.listNotifications({
        params,
      });
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
  },
};
