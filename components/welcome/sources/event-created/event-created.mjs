import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "welcome-event-created",
  name: "New Event Created",
  description: "Emit new event when a new event is created in Welcome. [See the documentation](https://app.experiencewelcome.com/api-docs/index.html)",
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
      return {
        id: resource.id,
        summary: `New Event: ${resource.name}`,
        ts: Date.parse(resource.updatedAt),
      };
    },
  },
  sampleEmit,
};
