import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "workiom-updated-record-instant",
  name: "Updated Record (Instant)",
  description: "Emit new event when a record is updated in a Workiom list. [See the documentation](https://help.workiom.com/article/workiom-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return 1;
    },
    generateMeta(record) {
      const ts = Date.parse(record._lastModifyDate);
      return {
        id: `${record._id}-${ts}`,
        summary: `Record updated with ID: ${record._id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
