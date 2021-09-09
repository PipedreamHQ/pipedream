const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-notification",
  name: "New Notification",
  description: "Emit new events when you receive new notifications",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(data) {
      const ts = new Date(data.updated_at).getTime();
      return {
        id: data.updated_at,
        summary: data.body || `Notification ID: ${data.id}`,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");

    const notifications = await this.github.getNotifications({
      participating: true,
      since,
    });

    let maxDate = since;
    for (const notification of notifications) {
      if (!maxDate || new Date(notification.updated_at) > new Date(maxDate)) {
        maxDate = notification.updated_at;
      }

      if (notification.subject.latest_comment_url == null) continue;
      const comment = await this.github.getUrl({
        url: notification.subject.latest_comment_url,
      });

      const meta = this.generateMeta(comment);
      this.$emit(comment, meta);
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate);
    }
  },
};
