import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-incomplete-task",
  name: "Incomplete Task",
  description: "Emit new event for each new incomplete task",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return element.checked === 0;
    },
  },
};
