import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "transifex-new-localization-activity-completed-instant",
  name: "New Localization Activity Completed (Instant)",
  description: "Emit new event when a resource language is completely translated, reviewed, or filled up by TM or MT.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "all_events";
    },
    filterEvent(body) {
      if ([
        "translation_completed",
        "review_completed",
        "fillup_completed",
      ].includes(body.event)) return true;
    },
    getSummary(body) {
      return `New event from resource: ${body.resource}.`;
    },
  },
  sampleEmit,
};
