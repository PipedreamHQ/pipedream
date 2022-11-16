import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Task",
  version: "0.0.2",
  key: "tick-new-task",
  description: "Emit new event on each created task.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceMethod() {
      return this.tick.getTasks;
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New task created with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
  },
};
