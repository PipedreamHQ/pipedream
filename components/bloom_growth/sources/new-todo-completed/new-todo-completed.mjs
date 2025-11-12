import common from "../common/base.mjs";

export default {
  ...common,
  key: "bloom_growth-new-todo-completed",
  name: "New To-Do Completed",
  version: "0.0.2",
  description: "Emit new event when a to-do is marked as completed.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction(bloomGrowth) {
      return bloomGrowth.listMeetingTodos;
    },
    filterRelevantItems(items) {
      return items.filter((item) => item.Complete);
    },
    getSummary(todoId) {
      return `To-do with id: "${todoId}" was completed!`;
    },
  },
};
