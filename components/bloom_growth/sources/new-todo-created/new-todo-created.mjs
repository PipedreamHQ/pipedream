import common from "../common/base.mjs";

export default {
  ...common,
  key: "bloom_growth-new-todo-created",
  name: "New To-Do Created",
  version: "0.0.3",
  description: "Emit new event when a new to-do is created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction(bloomGrowth) {
      return bloomGrowth.listMeetingTodos;
    },
    getSummary(todoId) {
      return `A new to-do with id: "${todoId}" was created!`;
    },
  },
};
