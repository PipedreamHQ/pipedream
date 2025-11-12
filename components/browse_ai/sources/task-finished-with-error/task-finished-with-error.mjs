import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "browse_ai-task-finished-with-error",
  name: "Task Finished With Error (Instant)",
  description: "Emit new event when a task finishes with an error. [See the documentation](https://www.browse.ai/docs/api/v2#tag/webhooks/operation/createNewWebhook)",
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
          status: "failed",
          sort: "-createdAt",
        },
      };
    },
    getResourcesName() {
      return "result.robotTasks.items";
    },
    getEventName() {
      return events.TASK_FINISHED_WITH_ERROR;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Failed Task: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
};
