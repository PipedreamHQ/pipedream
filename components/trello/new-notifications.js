const spotify = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Notifications",
  description: "Emits an event for each new Trello notification for the authenticated user.",
  version: "0.0.1",
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
    let notifications = [];
    let results = [];

    let since = this.db.get("lastNotificationId") || null;

    let params = {
      since,
    }

    results = await this.trello.getNotifications('me', params);
    results.forEach(function (notification) {
      notifications.push(notification);
    });

    if (results.length > 0)
      this.db.set("lastNotificationId", results[results.length-1].id);

    for (const notification of notifications) {
      this.$emit(notification, {
        id: notification.id,
        summary: `${notification.type} : ${notification.data.card.name}`,
        ts: notification.date,
      });
    }
  },
}