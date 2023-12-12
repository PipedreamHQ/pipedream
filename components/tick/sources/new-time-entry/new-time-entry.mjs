import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Time Entry",
  version: "0.0.3",
  key: "tick-new-time-entry",
  description: "Emit new event on each created time entry.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceMethod() {
      return this.tick.getTimeEntries;
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New time entry created with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
  },
};
