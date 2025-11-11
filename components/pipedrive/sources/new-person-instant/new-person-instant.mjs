import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-new-person-instant",
  name: "New Person (Instant)",
  description: "Emit new event when a new person is created.",
  version: "0.0.13",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "create",
        event_object: "person",
      };
    },
    getSummary(body) {
      return `New Person successfully created: ${body.data.id}`;
    },
  },
  sampleEmit,
};
