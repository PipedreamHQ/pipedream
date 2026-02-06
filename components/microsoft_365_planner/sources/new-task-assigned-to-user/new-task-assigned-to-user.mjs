import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_365_planner-new-task-assigned-to-user",
  name: "New Task Assigned to User",
  description: "Emit new event when a Task is assigned to the authenticated user in Microsoft 365 Planner. [See the documentation](https://learn.microsoft.com/en-us/graph/api/planneruser-list-tasks?view=graph-rest-1.0&tabs=http)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.microsoft365Planner.listUserTasks;
    },
    getArgs() {
      return {};
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: task.title,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const fn = this.getResourceFn();
    const args = this.getArgs();
    const items = this.microsoft365Planner.paginate({
      fn,
      args,
    });

    for await (const item of items) {
      this.emitEvent(item);
    }
  },
};
