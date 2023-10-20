import base from "../common/webhooks.mjs";

const docLink = "https://www.ragic.com/intl/en/doc-api/33/Webhook-on-Ragic";

export default {
  ...base,
  key: "ragic-record-created-instant",
  name: "New Created Record (Instant)",
  description: `Emit new event when a record is created. [Instructions on creating webhooks here](${docLink}).`,
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
