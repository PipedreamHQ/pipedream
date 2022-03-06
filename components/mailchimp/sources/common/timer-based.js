const base = require("./base");

module.exports = {
  ...base,
  props: {
    ...base.props,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // by default, run every 15 minutes.
      },
    },
  },
};
