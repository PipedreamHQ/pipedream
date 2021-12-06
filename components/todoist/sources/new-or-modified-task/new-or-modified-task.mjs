import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-new-or-modified-task",
  name: "New or Modified Task",
  description: "Emit an event for each new or modified task",
  version: "0.0.2",
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return true;
    },
  },
};
