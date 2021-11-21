const common = require("../common/http-based/custom-module");
const crudOps = require("../common/http-based/crud-operations");

module.exports = {
  ...common,
  key: "zoho_crm-updated-module-entry",
  name: "Updated Module Entry (Instant)",  // eslint-disable-line
  description: "Emit new event each time a new module/record is updated in Zoho CRM",
  version: "0.0.2",
  type: "source",
  methods: {
    ...common.methods,
    getSupportedOps() {
      return [
        crudOps.editOpData(),
      ];
    },
  },
};
