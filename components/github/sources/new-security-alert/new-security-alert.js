const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-security-alert",
  name: "New Security Alert",
  description:
    "Emit new events when GitHub discovers a security vulnerability in one of your repositories",
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
      "security_alert",
    );

    let maxDate = since;
    for (const notification of notifications) {
      if (!maxDate || new Date(notification.updated_at) > new Date(maxDate)) {
        maxDate = notification.updated_at;
      }
      const meta = this.generateMeta(notification);
      this.$emit(notification, meta);
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate);
    }
  },
};
