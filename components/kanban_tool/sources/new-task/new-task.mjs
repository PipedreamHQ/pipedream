import common from "../common/activity-based.mjs";

export default {
  ...common,
  key: "kanban_tool-new-task",
  name: "New Task Event",
  description: "Emit new events when a new task is created on selected board. [See the docs](https://kanbantool.com/developer/api-v3#listing-boards-changelogs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    compareFn(item) {
      return item?.what == "created";
    },
  },
};
