const common = require("../common/http-based/custom-single-module");
const crudOps = require("../common/http-based/crud-operations");

module.exports = {
  ...common,
  key: "zoho_crm-new-or-updated-module-entry",
  name: "New or Updated Module Entry (Instant)",
  description: "Emits an event each time a module/record is created or edited in Zoho CRM",
  version: "0.0.1",
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
