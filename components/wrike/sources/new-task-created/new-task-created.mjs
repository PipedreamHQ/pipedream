import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "wrike-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a task is created",
  type: "source",
  version: "0.0.1",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving created tasks...");
      const tasks = await this.wrike.listTasks({
        paginate: true,
      });
      for (const task of tasks.slice(constants.DEPLOY_LIMIT)) {
        this.emitEvent(task);
      }
    },
  },
  methods: {
    ...base.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New task: ${data.name}`,
        ts: data.createdDate,
      });
    },
  },
};
