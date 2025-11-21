import common from "../common/common-polling-pr-notifications.mjs";

export default {
  ...common,
  key: "github-new-review-request",
  name: "New Review Request",
  description: "Emit new event for new review request notifications. [See the documentation](https://docs.github.com/en/rest/activity/notifications?apiVersion=20.2.61-28#list-notifications-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(value) {
      this.db.set("lastDate", value);
    },
    async getItems() {
      const date = this._getLastDate();
      this._setLastDate(new Date().toISOString());
      return this.github.getFilteredNotifications({
        reason: "review_requested",
        data: {
          participating: true,
          all: true,
          ...(date && {
            since: date,
          }),
        },
      });
    },
    getItemMetadata(item) {
      return {
        summary: `New review request: "${item.title ?? item.id}"`,
        ts: Date.now(),
      };
    },
  },
};
