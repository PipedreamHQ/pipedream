const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-review-request",
  name: "New Review Request",
  description:
    "Emit new events when you or a team you're a member of are requested to review a pull request",
  version: "0.0.4",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const ts = new Date(data.updated_at).getTime();
      return {
        id: data.updated_at,
        summary: data.subject.title,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");

    const notifications = await this.getFilteredNotifications(
      {
        participating: false,
        since,
      },
      "review_requested",
    );

    let maxDate = since;
    for (const notification of notifications) {
      if (!maxDate || new Date(notification.updated_at) > new Date(maxDate)) {
        maxDate = notification.updated_at;
      }

      if (notification.subject.url == null) continue;
      notification.pull_request = await this.github.getUrl({
        url: notification.subject.url,
      });

      const meta = this.generateMeta(notification);
      this.$emit(notification, meta);
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate);
    }
  },
};
