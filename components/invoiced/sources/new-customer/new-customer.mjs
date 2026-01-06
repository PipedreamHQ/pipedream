import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "invoiced-new-customer",
  name: "New Customer Created",
  description: "Emit new event when a new customer is created. [See the documentation](https://developer.invoiced.com/api/customers#list-all-customers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.invoiced.listCustomers;
    },
    getSummary(item) {
      return `New Customer: ${item.id}`;
    },
  },
  sampleEmit,
};
