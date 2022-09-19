import common from "../common/http-based/custom-module.mjs";
import crudOps from "../common/http-based/crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-updated-module-entry",
  name: "Updated Module Entry (Instant)",
  description: "Emits an event each time a new module/record is updated in Zoho CRM",
  version: "0.0.10",
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
