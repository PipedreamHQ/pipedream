import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "caspio-record-deleted",
  name: "Record Deleted (Instant)",
  description: "Emit new event when a record in specified table is deleted",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "table.recordDelete";
    },
    generateMeta(body) {
      return {
        id: body.eventId,
        summary: `Record deleted with PK_ID: ${body.data[0].PK_ID}`,
        ts: Date.parse(body.eventDate),
      };
    },
  },
  sampleEmit,
};
