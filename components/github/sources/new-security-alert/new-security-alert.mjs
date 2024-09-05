import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-security-alert",
  name: "New Security Alert",
  description: "Emit new events when GitHub discovers a security vulnerability in one of your repositories",
  version: "0.1.19",
  type: "source",
  dedupe: "unique",
  async run() {
    const notifications = await this.github.getFilteredNotifications({
      reason: "security_alert",
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
