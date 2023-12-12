import common from "../common/activity-based.mjs";

export default {
  ...common,
  key: "kanban_tool-task-updated",
  name: "New Task Updated Event",
  description: "Emit new events when a task is updated on selected board. [See the docs](https://kanbantool.com/developer/api-v3#listing-boards-changelogs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    compareFn(item) {
      return item?.what == "updated";
    },
  },
};
