import common from "../common/common-polling-pr-notifications.mjs";

export default {
  ...common,
  key: "github-new-review-request",
  name: "New Review Request",
  description: "Emit new event for new review request notifications. [See the documentation](https://docs.github.com/en/rest/activity/notifications?apiVersion=2022-11-28#list-notifications-for-the-authenticated-user)",
  version: "0.1.17",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      return this.github.getFilteredNotifications({
        reason: "review_requested",
        data: {
          participating: true,
          all: true,
        },
      });
    },
    getItemMetadata(item) {
      return {
        summary: `New review request: ${item.title ?? item.id}`,
        ts: Date.now(),
      };
    },
  },
};
