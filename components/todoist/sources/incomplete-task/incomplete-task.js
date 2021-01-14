const common = require("../common-task.js");

module.exports = {
  ...common,
  key: "todoist-incomplete-task",
  name: "Incomplete Task",
  description: "Emit an event for each new incomplete task",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return element.checked === 0;
    },
  },
};
