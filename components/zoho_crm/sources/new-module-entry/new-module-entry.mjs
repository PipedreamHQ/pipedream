import common from "../common/http-based/custom-module.mjs";
import crudOps from "../common/http-based/crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-module-entry",
  name: "New Module Entry (Instant)",
  description: "Emits an event each time a new module/record is created in Zoho CRM",
  version: "0.0.8",
  type: "source",
  methods: {
    ...common.methods,
    getSupportedOps() {
      return [
        crudOps.createOpData(),
      ];
    },
  },
};
