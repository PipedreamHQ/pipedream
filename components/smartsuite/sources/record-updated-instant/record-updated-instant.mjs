import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "smartsuite-record-updated-instant",
  name: "Record Updated (Instant)",
  description: "Emit new event when an existing record is updated",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "RECORD_UPDATED";
    },
    getSummary({ record_event_data: data }) {
      return `Record updated with ID: ${data.record_id}`;
    },
  },
  sampleEmit,
};
