import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "caspio-new-record-created",
  name: "New Record Created (Instant)",
  description: "Emit new event when a new record in specified table is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "table.recordInsert";
    },
    generateMeta(body) {
      return {
        id: body.eventId,
        summary: `New record created with PK_ID: ${body.data[0].PK_ID}`,
        ts: Date.parse(body.eventDate),
      };
    },
  },
  sampleEmit,
};
