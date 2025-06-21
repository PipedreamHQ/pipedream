import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-person-instant",
  name: "PersonUpdated (Instant)",
  description: "Emit new event when a person is updated.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "change",
        event_object: "person",
      };
    },
    getSummary(body) {
      return `Person successfully updated: ${body.data.id}`;
    },
  },
  sampleEmit,
};
