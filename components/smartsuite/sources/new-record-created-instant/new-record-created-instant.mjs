import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "smartsuite-new-record-created-instant",
  name: "New Record Created (Instant)",
  description: "Emit new event when a new record is created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "RECORD_CREATED";
    },
    getSummary({ record_event_data: data }) {
      return `New record created with ID: ${data.record_id}`;
    },
  },
  sampleEmit,
};
