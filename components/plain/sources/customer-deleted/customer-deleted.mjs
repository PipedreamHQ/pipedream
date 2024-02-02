import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-customer-deleted",
  name: "Customer Deleted",
  description: "Emit new event when a customer is deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "customer.customer_deleted";
    },
    getSummary({ payload }) {
      return `Customer Deleted ID ${payload.previousCustomer.id}`;
    },
  },
  sampleEmit,
};
