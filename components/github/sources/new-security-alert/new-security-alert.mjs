import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-security-alert",
  name: "New Security Alert",
  description: "Emit new event for security alert notifications. [See the documentation](https://docs.github.com/en/rest/activity/notifications?apiVersion=20.2.61-28#list-notifications-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      return this.github.getFilteredNotifications({
        reason: "security_alert",
        data: {
          participating: true,
          all: true,
        },
      });
    },
    getItemMetadata(item) {
      return {
        summary: `New security alert: "${item.title ?? item.id}"`,
        ts: Date.now(),
      };
    },
  },
};
