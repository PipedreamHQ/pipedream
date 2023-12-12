import common from "../common/http-based/common-predefined-module.mjs";
import crudOps from "../common/http-based/common-crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-contact",
  name: "New Contact (Instant)",
  description: "Emits an event each time a new contact is created in Zoho CRM",
  version: "0.0.10",
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
