import common from "../common/base.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gotowebinar-webinar-changed",
  name: "Webinar Changed (Instant)",
  description: "Emit new event when a webinar is changed.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEventName() {
      return events.WEBINAR_CHANGED;
    },
    generateMeta({
      eventKey, webinarKey, registrationDate,
    }) {
      return {
        id: eventKey,
        summary: `A webinar with key ${webinarKey} has been successfully changed!`,
        ts: registrationDate,
      };
    },
  },
  sampleEmit,
};
