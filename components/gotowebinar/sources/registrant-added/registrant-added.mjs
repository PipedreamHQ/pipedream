import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gotowebinar-registrant-added",
  name: "New Registrant Added (Instant)",
  description: "Emit new event when a registrant is added.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEventName() {
      return "registrant.added";
    },
    generateMeta({
      eventKey, registrantKey, registrationDate,
    }) {
      return {
        id: eventKey,
        summary: `A new registrant with key ${registrantKey} has been successfully added!`,
        ts: registrationDate,
      };
    },
  },
  sampleEmit,
};
