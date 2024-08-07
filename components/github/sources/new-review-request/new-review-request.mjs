import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-review-request",
  name: "New Review Request",
  description: "Emit new events when you or a team you're a member of are requested to review a pull request",
  version: "0.1.17",
  type: "source",
  dedupe: "unique",
  async run() {
    const notifications = await this.github.getFilteredNotifications({
      reason: "review_requested",
      data: {
        participating: true,
        all: true,
      },
    });

    for (const notification of notifications) {
      if (notification.subject.notification === null) continue;

      const pullRequest = await this.github.getFromUrl({
        url: notification.subject.url,
      });

      this.$emit(pullRequest, {
        id: pullRequest.id,
        summary: `New notification ${pullRequest.id}`,
        ts: Date.parse(pullRequest.created_at),
      });
    }
  },
};
