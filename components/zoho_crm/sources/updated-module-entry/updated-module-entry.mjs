import common from "../common-http-based-custom-module.mjs";
import crudOps from "../common-util-crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-updated-module-entry",
  name: "Updated Module Entry (Instant)",  // eslint-disable-line
  description: "Emit new event each time a new module/record is updated in Zoho CRM",
  version: "0.0.3",
  type: "source",
  methods: {
    ...common.methods,
    getSupportedOps() {
      return [
        crudOps.editOpData(),
      ];
    },
  },
};
