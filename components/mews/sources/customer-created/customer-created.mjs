import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Customer",
  description: "Emit new event when a customer is created. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#get-all-customers)",
  key: "mews-customer-created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getRequester() {
      return this.app.customersGetAll;
    },
    getResultKey() {
      return "Customers";
    },
    getResourceName() {
      return "Customer";
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
