import common from "../common/common.mjs";

export default {
  ...common,
  key: "retently-new-customer-added",
  name: "New Customer Added",
  description: "Emit new event when a new customer is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.retently.listCustomers;
    },
    getResultField() {
      return "subscribers";
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.id,
        summary: subscriber.email,
        ts: Date.parse(subscriber.createdDate),
      };
    },
  },
};
