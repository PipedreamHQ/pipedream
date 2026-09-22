import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Task Assigned (Instant)",
  version: "0.0.2",
  key: "accelo-new-task-assigned",
  description: "Emit new event on each new task assigned.",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      const { response: tasks } = await this.accelo.getTasks({
        params: {
          _filters: "order_by_desc(date_created)",
          _limit: 10,
        },
      });

      for (const task of tasks.slice(0, 10).reverse()) {
        await this.emitEvent(task);
      }
    },
  },
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "assign_task";
    },
    async emitEvent(data) {
      const task = await this.accelo.getTask({
        taskId: data.id,
      });

      this.$emit(task, {
        id: data.id,
        summary: `New task assigned with ID ${data.id}`,
        ts: Date.parse(data.date_created),
      });
    },
  },
};
