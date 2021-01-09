const common = require("../common-task.js");

module.exports = {
  ...common,
  key: "todoist-new-or-modified-task",
  name: "New or Modified Task",
  description: "Emit an event for each new or modified task",
  version: "0.0.1",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return true;
    },
  },
};
