import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "browse_ai-task-completed",
  name: "Task Completed (Instant)",
  description: "Emits an event when a Browse AI task is completed. [See the documentation](https://www.browse.ai/docs/api/v2#tag/webhooks/operation/createNewWebhook)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.getRobotTasks;
    },
    getResourcesFnArgs() {
      return {
        robotId: this.robotId,
        params: {
          status: "successful",
          sort: "-createdAt",
        },
      };
    },
    getResourcesName() {
      return "result.robotTasks.items";
    },
    getEventName() {
      return events.TASK_FINISHED_SUCCESSFULLY;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Task: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
};
