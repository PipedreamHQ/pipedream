import common from "../common-http-based-predefined-module.mjs";
import crudOps from "../common-util-crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-lead",
  name: "New Lead (Instant)",
  description: "Emit new event each time a new lead is created in Zoho CRM",
  version: "0.0.2",
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
