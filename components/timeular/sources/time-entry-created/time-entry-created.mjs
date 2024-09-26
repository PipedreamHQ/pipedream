import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "timeular-time-entry-created",
  name: "New Time Entry Created (Instant)",
  description: "Emit new event when a time entry is created.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvent() {
      return "timeEntryCreated";
    },
    getField() {
      return "createdTimeEntry";
    },
    getSummary(id) {
      return `New time entry created with Id: ${id}!`;
    },
  },
  sampleEmit,
};
