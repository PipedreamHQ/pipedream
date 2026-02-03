import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "workiom-new-record-instant",
  name: "New Record (Instant)",
  description: "Emit new event when a new record is created in a Workiom list. [See the documentation](https://help.workiom.com/article/workiom-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return 0;
    },
    generateMeta(record) {
      const ts = Date.parse(record._creationDate);
      return {
        id: `${record._id}-${ts}`,
        summary: `New record created with ID: ${record._id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
