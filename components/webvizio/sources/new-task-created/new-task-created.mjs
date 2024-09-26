import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "webvizio-new-task-created",
  name: "New Task Created",
  version: "0.0.1",
  description: "Emit new event when a task is created. [See the documentation](https://webvizio.com/help-center/outgoing-webhooks/)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.TASK_CREATED;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Task: ${resource.name}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
