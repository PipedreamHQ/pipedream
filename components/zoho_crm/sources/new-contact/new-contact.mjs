import common from "../common/http-based/predefined-module.mjs";
import crudOps from "../common/http-based/crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-contact",
  name: "New Contact (Instant)",
  description: "Emits an event each time a new contact is created in Zoho CRM",
  version: "0.0.7",
  type: "source",
  methods: {
    ...common.methods,
    getModuleName() {
      return "Contact";
    },
    getSupportedOps() {
      return [
        crudOps.createOpData(),
      ];
    },
  },
};
