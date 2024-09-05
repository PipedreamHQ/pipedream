import common from "../common/polling.mjs";
import activityTypes from "../common/activity-types.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onedesk-new-timesheet-created",
  name: "New Timesheet Created",
  description: "Emit new event when a new timesheet is created. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getActivityTypeProperties() {
      return [
        {
          property: "types",
          operation: "EQ",
          value: activityTypes.ACTUAL_WORK_UPDATED,
        },
      ];
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.timestamp);
      return {
        id: `${resource.itemExternalId}-${ts}`,
        summary: `New Timesheet: ${resource.itemName || resource.itemExternalId}`,
        ts,
      };
    },
  },
  sampleEmit,
};
