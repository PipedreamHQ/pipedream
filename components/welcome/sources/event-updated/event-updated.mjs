import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "welcome-event-updated",
  name: "Event Updated",
  description: "Emit new event when an event is updated. [See the documentation](https://app.experiencewelcome.com/api-docs/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "updatedAt";
    },
    getResourceName() {
      return "events";
    },
    getResourcesFn() {
      return this.app.listEvents;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updatedAt);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Event Updated: ${resource.name}`,
        ts,
      };
    },
  },
  sampleEmit,
};
