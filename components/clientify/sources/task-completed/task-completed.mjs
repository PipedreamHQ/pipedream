import common from "../common/base.mjs";

export default {
  ...common,
  key: "clientify-task-completed",
  name: "New Task Completed",
  version: "0.0.2",
  description: "Emit new event when a task is completed.",
  type: "source",
  methods: {
    ...common.methods,
    getFunction() {
      return this.clientify.listTasks;
    },
    getSummary({ id }) {
      return `The task with id: "${id}" was completed!`;
    },
    getParams(lastDate) {
      return {
        "orderBy": "created",
        "created[gte]": lastDate,
        "status_id": 5,
      };
    },
  },
};
