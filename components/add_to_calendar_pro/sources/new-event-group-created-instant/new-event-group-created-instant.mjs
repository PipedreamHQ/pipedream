import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "add_to_calendar_pro-new-event-group-created-instant",
  name: "New Event Group Created (Instant)",
  description: "Emit new event when a new event group is created in the system",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "create";
    },
    getTriggerElement() {
      return "event_group";
    },
    generateMeta({ element_data: item }) {
      return {
        id: item.prokey,
        summary: `New Event Group Created with ProKey: ${item.prokey}`,
        ts: Date.parse(item.date_created),
      };
    },
  },
  sampleEmit,
};
