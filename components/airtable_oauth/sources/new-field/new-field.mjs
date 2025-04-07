import common from "../common/common-webhook-field.mjs";

export default {
  ...common,
  name: "New Field Created (Instant)",
  description: "Emit new event when a field is created in the selected table. [See the documentation](https://airtable.com/developers/web/api/get-base-schema)",
  key: "airtable_oauth-new-field",
  version: "1.0.2",
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
