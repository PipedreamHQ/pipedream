import common from "../common/polling.mjs";
import activityTypes from "../common/activity-types.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onedesk-new-item-created",
  name: "New Item Created",
  description: "Emit new event when a new item is created. [See the documentation](https://www.onedesk.com/dev/).",
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
          value: activityTypes.CREATED_WORK_ITEM,
        },
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.itemExternalId,
        summary: `New Item Created: ${resource.itemName || resource.itemExternalId}`,
        ts: Date.parse(resource.timestamp),
      };
    },
  },
  sampleEmit,
};
