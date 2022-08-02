import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Task (Instant)",
  version: "0.0.1",
  key: "awork-new-task",
  description: "Emit new event on each created task.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "task_added";
    },
    emitEvent(body) {
      const data = body.entity;

      this.$emit(data, {
        id: data.id,
        summary: `New task created with id ${data.id}`,
        ts: Date.parse(data.createdOn),
      });
    },
  },
};
