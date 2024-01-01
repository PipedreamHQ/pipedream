import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "resource_guru-new-resource-event-instant",
  name: "New Resource Event (Instant)",
  description: "Emit new event when a resource is created, updated or deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "resources",
      ];
    },
    getSummary(body) {
      return `New resource ${body.payload.action}d`;
    },
  },
  sampleEmit,
};
