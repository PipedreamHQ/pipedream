import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-completed-task",
  name: "Completed Task",
  description: "Emit new event for each completed task. [See the docs here](https://developer.todoist.com/sync/v8/#read-resources)",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return element.checked === 1;
    },
  },
};
