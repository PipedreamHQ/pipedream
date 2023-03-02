import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "paymo-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created. [See the docs](https://github.com/paymoapp/api/blob/master/sections/webhooks.md#events).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.TASK.INSERT;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Task: ${resource.name}`,
        ts: Date.parse(resource.created_on),
      };
    },
  },
};
