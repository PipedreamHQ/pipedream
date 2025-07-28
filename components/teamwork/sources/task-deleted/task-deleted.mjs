import common from "../common/common-sources.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "teamwork-task-deleted",
  name: "New Task Deleted (Instant)",
  description: "Emit new event when a new task is deleted",
  version: "0.0.2",
  methods: {
    ...common.methods,
    _getEventName() {
      return "TASK.DELETED";
    },
    generateMeta(body) {
      return {
        id: body.ID,
        summary: `${body.ID} deleted by ${body["EventCreator.FirstName"]} ${body["EventCreator.LastName"]}`,
        ts: Date.now(),
      };
    },
  },
};
