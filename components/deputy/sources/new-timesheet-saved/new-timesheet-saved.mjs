import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "deputy-new-timesheet-saved",
  name: "New Timesheet Saved (Instant)",
  description: "Emit new event when a new timesheet has been saved",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "Timesheet.Save";
    },
    generateMeta(timesheet) {
      return {
        id: timesheet.Id,
        summary: `New Timesheet: ${timesheet.Id}`,
        ts: Date.parse(timesheet.Created),
      };
    },
  },
  sampleEmit,
};
