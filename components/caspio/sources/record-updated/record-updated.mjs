import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "caspio-record-updated",
  name: "Record Updated (Instant)",
  description: "Emit new event when a record in specified table is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "table.recordUpdate";
    },
    generateMeta(body) {
      return {
        id: body.eventId,
        summary: `Record updated with PK_ID: ${body.data[0].PK_ID}`,
        ts: Date.parse(body.eventDate),
      };
    },
  },
  sampleEmit,
};
