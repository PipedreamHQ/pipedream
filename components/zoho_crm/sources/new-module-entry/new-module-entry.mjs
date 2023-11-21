import common from "../common/http-based/common-custom-module.mjs";
import crudOps from "../common/http-based/common-crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-module-entry",
  name: "New Module Entry (Instant)",
  description: "Emit new events each time a new module/record is created in Zoho CRM",
  version: "0.0.14",
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
