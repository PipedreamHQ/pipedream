import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-completed-task",
  name: "Completed Task",
  description: "Emit new event for each completed task",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return element.checked === 1;
    },
  },
};
