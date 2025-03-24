import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-deal-instant",
  name: "New Deal Update (Instant)",
  description: "Emit new event when a deal is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "updated",
        event_object: "deal",
      };
    },
    getSummary(body) {
      return `Deal successfully updated: ${body.current.id}`;
    },
  },
  sampleEmit,
};
