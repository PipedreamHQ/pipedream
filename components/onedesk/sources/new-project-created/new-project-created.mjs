import common from "../common/polling.mjs";
import activityTypes from "../common/activity-types.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onedesk-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created. [See the documentation](https://www.onedesk.com/dev/).",
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
          value: activityTypes.CREATED_PROJECT,
        },
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.itemExternalId,
        summary: `New Project Created: ${resource.itemName}`,
        ts: Date.parse(resource.timestamp),
      };
    },
  },
  sampleEmit,
};
