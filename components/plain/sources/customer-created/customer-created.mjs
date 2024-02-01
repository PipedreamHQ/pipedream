import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-customer-created",
  name: "Customer Created",
  description: "Emit new event when a customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "customer.customer_created";
    },
    getSummary({ payload }) {
      return `Customer Created ID ${payload.customer.id}`;
    },
  },
  sampleEmit,
};
