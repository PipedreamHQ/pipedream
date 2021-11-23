import common from "../common-http-based-predefined-module.mjs";
import crudOps from "../common-util-crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-or-updated-lead",
  name: "New or Updated Lead (Instant)",
  description: "Emit new event each time a new lead is created or updated in Zoho CRM",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getModuleName() {
      return "Lead";
    },
    getSupportedOps() {
      return [
        crudOps.createOpData(),
        crudOps.editOpData(),
      ];
    },
  },
};
