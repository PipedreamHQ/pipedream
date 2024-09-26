import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "helpspace-new-customer",
  name: "New Customer (Instant)",
  description: "Emit new event when a new customer signs up on Helpspace. Note: Users may only have one active Helpspace webhook at a time. [See the documentation](https://documentation.helpspace.com/article/340/webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      const baseTrigger = this.getBaseTrigger();
      return {
        ...baseTrigger,
        customer: {
          ...baseTrigger.customer,
          created: true,
        },
      };
    },
    generateMeta(customer) {
      return {
        id: customer.id,
        summary: `New Customer ${customer.name}`,
        ts: Date.parse(customer.created_at),
      };
    },
  },
  sampleEmit,
};
