import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Company",
  description: "Emit new event when a company is created. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/companies#get-all-companies)",
  key: "mews-company-created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getRequester() {
      return this.app.companiesGetAll;
    },
    getResultKey() {
      return "Companies";
    },
    getResourceName() {
      return "Company";
    },
    getId(resource) {
      return resource?.Id || resource?.id;
    },
    getDateField() {
      return "CreatedUtc";
    },
    getDateFilterField() {
      return "CreatedUtc";
    },
  },
};
