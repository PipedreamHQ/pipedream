import common from "../common/common-webhook-record.mjs";

export default {
  ...common,
  name: "New or Modified Records (Instant)",
  key: "airtable_oauth-new-or-modified-records",
  description: "Emit new event for each new or modified record in a table or view",
  version: "1.0.0",
  type: "source",
  methods: {
    ...common.methods,
    getChangeTypes() {
      return [
        "add",
        "update",
      ];
    },
  },
};
