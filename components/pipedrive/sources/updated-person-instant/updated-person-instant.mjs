import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-person-instant",
  name: "New Person Update (Instant)",
  description: "Emit new event when a person is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "updated",
        event_object: "person",
      };
    },
    getSummary(body) {
      return `Person successfully updated: ${body.current.id}`;
    },
  },
  sampleEmit,
};
