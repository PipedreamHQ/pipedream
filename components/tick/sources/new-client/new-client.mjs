import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Client",
  version: "0.0.1",
  key: "tick-new-client",
  description: "Emit new event on each created client.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceMethod() {
      return this.tick.getClients;
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New client created with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
  },
};
