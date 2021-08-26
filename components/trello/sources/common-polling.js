const common = require("./common.js");

module.exports = {
  ...common,
  props: {
    ...common.props,
    key: "trello-sources-common-polling-file",
    name: "Sources Common Polling File",
    description: "Common file with methods and props for Trello polling based sources.",
    type: "source",
    version: "0.0.1",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
};
