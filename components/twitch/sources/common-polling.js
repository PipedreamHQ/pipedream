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
    },
  },
  methods: {
    ...common.methods,
    getLastEvent(lastEvent) {
      return lastEvent ? new Date(lastEvent) : new Date();
    },
  },
};