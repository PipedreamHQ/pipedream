import common from "../common/base.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gotowebinar-registrant-joined",
  name: "New Registrant Joined (Instant)",
  description: "Emit new event when a registrant joins a weginar.",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEventName() {
      return events.REGISTRANT_JOINED;
    },
    generateMeta({
      eventKey, registrantKey, registrationDate,
    }) {
      return {
        id: eventKey,
        summary: `A new registrant with key ${registrantKey} has been successfully joined!`,
        ts: registrationDate,
      };
    },
  },
  sampleEmit,
};
