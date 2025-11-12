import common from "../common/base.mjs";

export default {
  ...common,
  key: "cogmento-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created in Cogmento. [See the documentation](https://api.cogmento.com/static/swagger/index.html#/Tasks/get_tasks_)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.cogmento.listTasks;
    },
    getSummary(item) {
      return `New Task Created: ${item.title}`;
    },
  },
};
