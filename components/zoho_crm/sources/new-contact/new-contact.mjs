import common from "../common-http-based-predefined-module.mjs";
import crudOps from "../common-util-crud-operations.mjs";

export default {
  ...common,
  key: "zoho_crm-new-contact",
  name: "New Contact (Instant)",
  description: "Emit new event each time a new contact is created in Zoho CRM",
  version: "0.0.2",
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
