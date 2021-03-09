const github = require("../github.app.js");

module.exports = {
  props: {
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
  },
  methods: {
    async getFilteredNotifications(params, reason) {
      const notifications = await this.github.getNotifications(params);
      return notifications.filter(
        (notification) => notification.reason === reason
      );
    },
  },
};