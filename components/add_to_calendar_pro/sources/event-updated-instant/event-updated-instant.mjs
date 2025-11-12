import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "add_to_calendar_pro-event-updated-instant",
  name: "Event Updated (Instant)",
  description: "Emit new event when a new event is updated in the system",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "update";
    },
    getTriggerElement() {
      return "event";
    },
    generateMeta({ element_data: item }) {
      const ts = Date.parse(item.date_updated);
      return {
        id: `${item.prokey}${ts}`,
        summary: `Event Updated with ProKey: ${item.prokey}`,
        ts,
      };
    },
  },
  sampleEmit,
};
