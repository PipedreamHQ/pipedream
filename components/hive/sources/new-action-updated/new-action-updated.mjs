import common from "../common/base.mjs";

export default {
  ...common,
  key: "hive-new-action-updated",
  name: "New Action Updated",
  version: "0.0.1",
  description: "Emit new event when an action is updated.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction(hive) {
      return hive.listActions;
    },
    getSummary(actionId) {
      return `An action with id: "${actionId}" was updated!`;
    },
    getField() {
      return "modifiedAt";
    },
  },
};
