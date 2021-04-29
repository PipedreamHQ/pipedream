const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "trello-new-notification",
  name: "New Notification",
  description:
    "Emits an event for each new Trello notification for the authenticated user.",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastNotificationId() {
      return this.db.get("lastNotificationId") || null;
    },
    _setLastNotificationId(notifications) {
      this.db.set(
        "lastNotificationId",
        notifications[notifications.length - 1].id
      );
    },
    generateMeta({ id, type, date, data }) {
      return {
        id,
        summary: `${type} : ${data.card.name}`,
        ts: Date.parse(date),
      };
    },
  },
  async run(event) {
    const since = this._getLastNotificationId();
    const params = {
      since,
    };

    const notifications = await this.trello.getNotifications("me", params);

    if (notifications.length > 0) this._setLastNotificationId(notifications);

    for (const notification of notifications) {
      this.emitEvent(notification);
    }
  },
};