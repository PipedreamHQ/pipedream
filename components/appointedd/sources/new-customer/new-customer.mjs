import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "appointedd-new-customer",
  name: "New Customer",
  description: "Emit new event when a new customer is created in one of your Appointedd organisations. [See the documentation](https://developers.appointedd.com/reference/get-customers)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.appointedd.listCustomers;
    },
    getParams() {
      return {
        sort_by: "created",
        order_by: "descending",
      };
    },
    getTsField() {
      return "created";
    },
    generateMeta(customer) {
      return {
        id: customer.id,
        summary: `New Customer with ID ${customer.id}`,
        ts: Date.parse(customer.created),
      };
    },
  },
  sampleEmit,
};
