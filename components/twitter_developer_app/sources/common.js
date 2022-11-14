const twitter_developer_app = require("../twitter_developer_app.app");
const { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } = require("@pipedream/platform");

module.exports = {
  props: {
    twitter_developer_app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
};
