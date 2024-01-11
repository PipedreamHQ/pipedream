import common from "../common/base.mjs";
import events from "./../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gotowebinar-webinar-created",
  name: "New Webinar Created (Instant)",
  description: "Emit new event when a webinar is created.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEventName() {
      return events.WEBINAR_CREATED;
    },
    generateMeta({
      eventKey, webinarKey, webinarCreationDate,
    }) {
      return {
        id: eventKey,
        summary: `A new webinar with key ${webinarKey} has been successfully created!`,
        ts: Date.parse(webinarCreationDate),
      };
    },
  },
  sampleEmit,
};
