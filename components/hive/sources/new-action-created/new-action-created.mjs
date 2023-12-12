import common from "../common/base.mjs";

export default {
  ...common,
  key: "hive-new-action-created",
  name: "New Action Created",
  version: "0.0.1",
  description: "Emit new event when a new action is created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction(hive) {
      return hive.listActions;
    },
    getSummary(actionId) {
      return `A new action with id: "${actionId}" was created!`;
    },
    getField() {
      return "createdAt";
    },
  },
};
