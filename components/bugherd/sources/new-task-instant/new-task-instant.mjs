import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bugherd-new-task-instant",
  name: "New Task (Instant)",
  description: "Emit new event when a new task is created. [See the documentation](https://www.bugherd.com/api_v2#api_webhook_create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "task_create";
    },
    generateMeta(data) {
      const ts = data.task.created_at;
      const id = data.task.id;
      return {
        id: `${id}-${ts}`,
        summary: `New task: ${id}`,
        ts,
      };
    },
  },
  sampleEmit,
};

