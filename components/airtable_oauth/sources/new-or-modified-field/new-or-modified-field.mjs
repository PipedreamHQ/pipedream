import common from "../common/common-webhook-field.mjs";

export default {
  ...common,
  name: "New or Modified Field (Instant)",
  description: "Emit new event when a field is created or updated in the selected table",
  key: "airtable_oauth-new-or-modified-field",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
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
