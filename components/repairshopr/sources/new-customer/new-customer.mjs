import common from "../common/source.mjs";

export default {
  ...common,
  key: "repairshopr-new-customer",
  type: "source",
  name: "New Customer",
  description: "Emit new event when a new customer is created.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getData() {
      return this.app.listCustomers;
    },
  },
};
