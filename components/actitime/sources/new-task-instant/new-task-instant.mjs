import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "actitime-new-task-instant",
  name: "New Task (Instant)",
  description: "Emit new event when a new task is created. [See the documentation](https://www.actitime.com/api-documentation/rest-hooks).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.TASK_CREATE;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Task: ${resource.name}`,
        ts: resource.created,
      };
    },
  },
  sampleEmit,
};
