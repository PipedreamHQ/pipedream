import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-new-dispatch-created",
  name: "New Dispatch Created (Instant)",
  description: "Emit new event when a dispatch is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "dispatch.created",
      ];
    },
    generateMeta(data) {
      return {
        id: data.dispatch.id,
        summary: `Dispatch ${data.dispatch.id} created`,
        ts: Date.parse(data.dispatch.created),
      };
    },
  },
  sampleEmit,
};
