import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "timeular-time-entry-updated",
  name: "New Time Entry Updated (Instant)",
  description: "Emit new event when a time entry is updated.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "timeEntryUpdated";
    },
    getField() {
      return "updatedTimeEntry";
    },
    getSummary(id) {
      return `The time entry with Id: ${id} was updated!`;
    },
  },
  sampleEmit,
};
