import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "everhour-task-time-updated-instant",
  name: "New Task Time Updated (Instant)",
  description: "Emit new event when a task's time spent is modified in Everhour.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "api:time:updated",
      ];
    },
    getSummary(body) {
      return `Task Time Updated: ${body.payload.data.id}`;
    },
  },
  sampleEmit,
};
