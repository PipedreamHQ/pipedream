const base = require("./base");

module.exports = {
  ...base,
  props: {
    ...base.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
};
