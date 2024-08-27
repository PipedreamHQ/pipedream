import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-notification",
  name: "New Notification",
  description: "Emit new events when you received a new notification",
  version: "0.1.17",
  type: "source",
  dedupe: "unique",
  async run() {
    const notifications = await this.github.getFilteredNotifications({
      data: {
        participating: true,
        all: true,
      },
    });

    notifications.map((notification) => {
      this.$emit(notification, {
        id: notification.id,
        summary: `New notification ${notification.id}`,
        ts: Date.parse(notification.created_at),
      });
    });
  },
};
