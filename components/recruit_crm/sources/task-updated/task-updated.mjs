import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "recruit_crm-task-updated",
  name: "Task Updated (Instant)",
  description: "Triggers when a task is updated. [See the documentation](https://docs.recruitcrm.io/docs/rcrm-api-reference/5e7ebc825ccf9-creates-a-new-subscription)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listTasks;
    },
    getResourcesFnArgs() {
      return {
        params: {
          limit: constants.PAGINATION.LIMIT,
          sort_by: constants.PAGINATION.SORT_BY.UPDATED_ON,
          sort_order: constants.PAGINATION.SORT_ORDER.DESC,
        },
      };
    },
    getEventName() {
      return events.TASK_UPDATED;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_on);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Task Updated: ${resource.title}`,
        ts,
      };
    },
  },
};
