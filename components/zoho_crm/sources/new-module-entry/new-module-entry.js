const common = require("../common/http-based/custom-single-module");
const crudOps = require("../common/http-based/crud-operations");

module.exports = {
  ...common,
  key: "zoho_crm-new-module-entry",
  name: "New Module Entry (Instant)",
  description: "Emits an event each time a new module/record is created in Zoho CRM",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getSupportedOps() {
      return [
        crudOps.createOpData(),
      ];
    },
  },
};
