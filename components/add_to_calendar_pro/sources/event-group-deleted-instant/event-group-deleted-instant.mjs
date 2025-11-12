import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "add_to_calendar_pro-event-group-deleted-instant",
  name: "Event Group Deleted (Instant)",
  description: "Emit new event when a new event group is deleted in the system",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "delete";
    },
    getTriggerElement() {
      return "event_group";
    },
    generateMeta({ element_data: item }) {
      return {
        id: item.prokey,
        summary: `Event Group Deleted with ProKey: ${item.prokey}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
