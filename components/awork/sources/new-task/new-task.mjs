import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Task (Instant)",
  version: "0.0.3",
  key: "awork-new-task",
  description: "Emit new event on each created task.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "task_added";
    },
    async deploy() {
      const tasks = await this.awork.getTasks({
        params: {
          pageSize: 10,
          orderby: "CreatedOn DESC",
        },
      });

      tasks.reverse().forEach(this.emitEvent);
    },
    emitEvent(body) {
      const data = body?.entity ?? body;

      this.$emit(data, {
        id: data.id,
        summary: `New task created with id ${data.id}`,
        ts: Date.parse(data.createdOn),
      });
    },
  },
};
