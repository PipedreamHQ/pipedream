import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "trello-new-notification",
  name: "New Notification",
  description: "Emit new event for each new Trello notification for the authenticated user.",
  version: "0.1.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastNotificationId() {
      return this.db.get("lastNotificationId") || null;
    },
    _setLastNotificationId(lastNotificationId) {
      this.db.set("lastNotificationId", lastNotificationId);
    },
    generateMeta({
      id, type, date, data,
    }) {
      return {
        id,
        summary: `${type} : ${data.card.name}`,
        ts: Date.parse(date),
      };
    },
  },
  async run() {
    const since = this._getLastNotificationId();

    const notifications = await this.app.getNotifications({
      notificationId: "me",
      params: {
        since,
      },
    });

    const { length: notificationCount = 0 } = notifications;
    if (notificationCount <= 0) {
      console.log("No notifications to process");
      return;
    }
    const { id } = notifications[notificationCount - 1];
    this._setLastNotificationId(id);

    for (const notification of notifications) {
      this.emitEvent(notification);
    }
  },
};
