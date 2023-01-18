import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Task Assigned (Instant)",
  version: "0.0.1",
  key: "accelo-new-task-assigned",
  description: "Emit new event on each new task assigned.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "assign_task";
    },
    async deploy() {
      const { response: tasks } = await this.accelo.getTasks({
        params: {
          _filters: "order_by_desc(date_created)",
          _limit: 10,
        },
      });

      tasks.slice(0, 10).reverse()
        .forEach(this.emitEvent);
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
