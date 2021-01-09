const common = require("../common-task.js");

module.exports = {
  ...common,
  key: "todoist-new-task",
  name: "New Task",
  description: "Emit updates for your selected resources",
  version: "0.0.1",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return true;
    },
  },
};
