import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "add_to_calendar_pro-new-event-created-instant",
  name: "New Event Created (Instant)",
  description: "Emit new event when a new event is created in the system",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "create";
    },
    getTriggerElement() {
      return "event";
    },
    generateMeta({ element_data: item }) {
      return {
        id: item.prokey,
        summary: `New Event Created with ProKey: ${item.prokey}`,
        ts: Date.parse(item.date_created),
      };
    },
  },
  sampleEmit,
};
