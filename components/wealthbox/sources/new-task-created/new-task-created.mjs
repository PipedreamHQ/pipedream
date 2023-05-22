import common from "../common/common.mjs";

export default {
  ...common,
  key: "wealthbox-new-task-created",
  name: "New Task Created",
  description: "Emit new event for each task created. [See the documentation](http://dev.wealthbox.com/#tasks-collection-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEvents({ params }) {
      const { tasks } = await this.wealthbox.listTasks({
        params,
      });
      return tasks;
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: `New Task - ${task.name}`,
        ts: this.getCreatedAtTs(task),
      };
    },
  },
  async run() {
    await this.processEvent(false);
  },
};
