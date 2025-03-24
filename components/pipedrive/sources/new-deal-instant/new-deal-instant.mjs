import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-new-deal-instant",
  name: "New Deal (Instant)",
  description: "Emit new event when a new deal is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "added",
        event_object: "deal",
      };
    },
    getSummary(body) {
      return `New Deal successfully created: ${body.current.id}`;
    },
  },
  sampleEmit,
};
