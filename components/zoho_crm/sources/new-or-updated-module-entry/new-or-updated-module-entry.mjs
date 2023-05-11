import common from "../common/http-based/common-custom-module.mjs";
import crudOps from "../common/http-based/common-crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-or-updated-module-entry",
  name: "New or Updated Module Entry (Instant)",
  description: "Emits an event each time a module/record is created or edited in Zoho CRM",
  version: "0.0.11",
  type: "source",
  methods: {
    ...common.methods,
    getSupportedOps() {
      return [
        crudOps.createOpData(),
        crudOps.editOpData(),
      ];
    },
  },
};
