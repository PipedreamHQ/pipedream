import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-new-task",
  name: "New Task",
  description: "Emit new updates for your selected resources",
  version: "0.0.2",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    isElementRelevant() {
      return true;
    },
  },
};
