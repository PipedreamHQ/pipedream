const common = require("./common.js");

module.exports = {
  ...common,
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
      label: "Timer",
      description: "The frequency in seconds you'd like to poll for new events.",
    },
  },
};
