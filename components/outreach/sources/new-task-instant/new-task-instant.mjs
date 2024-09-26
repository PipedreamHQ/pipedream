import common from "../common/base.mjs";

export default {
  ...common,
  key: "outreach-new-task-instant",
  name: "New Task Event (Instant)",
  description: "Emit new event when a task is created, updated, destroyed or completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResource() {
      return "task";
    },
  },
};
