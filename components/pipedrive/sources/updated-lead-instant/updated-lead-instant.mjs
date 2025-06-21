import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-lead-instant",
  name: "Lead Updated (Instant)",
  description: "Emit new event when a lead is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "change",
        event_object: "lead",
      };
    },
    getSummary(body) {
      return `Lead successfully updated: ${body.data.id}`;
    },
  },
  sampleEmit,
};
