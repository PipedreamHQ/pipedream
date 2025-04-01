import common from "../common/common-webhook-record.mjs";

export default {
  ...common,
  name: "New Record(s) Created (Instant)",
  description: "Emit new event for each new record in a table",
  key: "airtable_oauth-new-records",
  version: "1.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getChangeTypes() {
      return [
        "add",
      ];
    },
  },
};
