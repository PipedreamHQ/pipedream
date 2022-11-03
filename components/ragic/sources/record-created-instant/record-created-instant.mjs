import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "ragic-record-created-instant",
  name: "New Created Record (Instant)",
  description: "Emit new event when a record is created",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    isRelevant(recordId) {
      if (this.isNew(recordId)) {
        this.addRecord(recordId);
        return true;
      }
    },
  },
};
