import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "add_to_calendar_pro-rsvp-answer-updated-instant",
  name: "RSVP Answer Updated (Instant)",
  description: "Emit new RSVP answer when a new RSVP answer is updated in the system",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "update";
    },
    getTriggerElement() {
      return "rsvp_answer";
    },
    generateMeta({ element_data: item }) {
      const ts = Date.parse(item.date_updated);
      return {
        id: `${item.prokey}${ts}`,
        summary: `RSVP Answer Updated with ProKey: ${item.prokey}`,
        ts,
      };
    },
  },
  sampleEmit,
};
