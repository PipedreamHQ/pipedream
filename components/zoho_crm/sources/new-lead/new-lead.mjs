import common from "../common/http-based/predefined-module.mjs";
import crudOps from "../common/http-based/crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-lead",
  name: "New Lead (Instant)",
  description: "Emits an event each time a new lead is created in Zoho CRM",
  version: "0.0.8",
  type: "source",
  methods: {
    ...common.methods,
    getModuleName() {
      return "Lead";
    },
    getSupportedOps() {
      return [
        crudOps.createOpData(),
      ];
    },
  },
};
