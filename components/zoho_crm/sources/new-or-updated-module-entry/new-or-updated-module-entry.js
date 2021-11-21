const common = require("../common/http-based/custom-module");
const crudOps = require("../common/http-based/crud-operations");

module.exports = {
  ...common,
  key: "zoho_crm-new-or-updated-module-entry",
  name: "New or Updated Module Entry (Instant)",
  description: "Emit new event each time a module/record is created or edited in Zoho CRM",
  version: "0.0.2",
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
