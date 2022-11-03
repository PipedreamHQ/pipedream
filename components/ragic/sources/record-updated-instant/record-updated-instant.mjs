import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "ragic-record-updated-instant",
  name: "New Updated Record (Instant)",
  description: "Emit new event when a record is updated",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    isRelevant(recordId) {
      if (this.isUpdate(recordId)) {
        return true;
      }
      this.addRecord(recordId);
    },
  },
};
