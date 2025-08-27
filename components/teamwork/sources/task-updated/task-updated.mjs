import common from "../common/common-sources.mjs";

export default {
  ...common,
  type: "source",
  key: "teamwork-task-updated",
  name: "New Task Updated (Instant)",
  description: "Emit new event when a new task is updated",
  version: "0.0.2",
  methods: {
    ...common.methods,
    _getEventName() {
      return "TASK.UPDATED";
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
