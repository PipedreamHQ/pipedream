import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_sheet-new-workbook-instant",
  name: "New Workbook Created (Instant)",
  description: "Emit new event whenever a new workbook is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "new_workbook";
    },
    getSummary(event) {
      return  `New workbook: ${event.workbook_name} (${event.resource_id})`;
    },
  },
  sampleEmit,
};
