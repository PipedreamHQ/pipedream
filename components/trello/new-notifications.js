const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Notifications",
  description:
    "Emits an event for each new Trello notification for the authenticated user.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    trello,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let notificationDate;
    const since = this.db.get("lastNotificationId") || null;
    const params = {
      since,
    };

    const notifications = await this.trello.getNotifications("me", params);

    if (notifications.length > 0)
      this.db.set(
        "lastNotificationId",
        notifications[notifications.length - 1].id
      );

    for (const notification of notifications) {
      notificationDate = new Date(notification.date);
      this.$emit(notification, {
        id: notification.id,
        summary: `${notification.type} : ${notification.data.card.name}`,
        ts: notificationDate.getTime(),
      });
    }
  },
};