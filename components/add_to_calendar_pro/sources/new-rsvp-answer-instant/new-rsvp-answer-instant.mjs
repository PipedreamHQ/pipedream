import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "add_to_calendar_pro-new-rsvp-answer-instant",
  name: "New RSVP Answer (Instant)",
  description: "Emit new RSVP answer when a new RSVP answer is created in the system",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "create";
    },
    getTriggerElement() {
      return "rsvp_answer";
    },
    generateMeta({ element_data: item }) {
      return {
        id: `${item.prokey}${item.email}`,
        summary: `New RSVP Answer with ProKey: ${item.prokey}`,
        ts: Date.parse(item.date_created),
      };
    },
  },
  sampleEmit,
};
