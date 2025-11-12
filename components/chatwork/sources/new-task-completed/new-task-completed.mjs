import common from "../common/common.mjs";

export default {
  ...common,
  key: "chatwork-new-task-completed",
  name: "New Task Completed",
  description: "Emit new event each time a task is completed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources() {
      return this.chatwork.listTasks({
        roomId: this.room,
        params: {
          status: "done",
        },
      });
    },
    getTs() {
      return Date.now();
    },
    generateMeta(task) {
      return {
        id: task.task_id,
        summary: task.body,
        ts: Date.now(),
      };
    },
  },
};
