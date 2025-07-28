import common from "../common/common-sources.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "teamwork-new-task",
  name: "New Task (Instant)",
  description: "Emit new event when a new task is created",
  version: "0.0.2",
  methods: {
    ...common.methods,
    _getEventName() {
      return "TASK.CREATED";
    },
    generateMeta(body) {
      return {
        id: body["Task.ID"],
        summary: body["Task.Name"],
        ts: body["Task.DateCreated"],
      };
    },
  },
};
