const common = require("../common-task.js");

module.exports = {
  ...common,
  key: "todoist-completed-task",
  name: "Completed Task",
  description: "Emit an event for each completed task",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return element.checked === 1;
    },
  },
};
