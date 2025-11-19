import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-notification",
  name: "New Notification",
  description: "Emit new event when the authenticated user receives a new notification. [See the documentation](https://docs.github.com/en/rest/activity/notifications?apiVersion=20.2.61-28#list-notifications-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      return this.github.getFilteredNotifications({
        data: {
          participating: true,
          all: true,
        },
      });
    },
    getItemMetadata(item) {
      return {
        summary: `New notification: ${item.id}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
