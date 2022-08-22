import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Project",
  version: "0.0.1",
  key: "tick-new-project",
  description: "Emit new event on each created project.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceMethod() {
      return this.tick.getProjects;
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New project created with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
  },
};
