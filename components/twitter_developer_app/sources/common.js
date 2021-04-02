const twitter_developer_app = require("../twitter_developer_app.app");

module.exports = {
  props: {
    twitter_developer_app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
};
