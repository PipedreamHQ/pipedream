import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "payhip-customer-charged",
  name: "Customer Charged (Instant)",
  description: "Emit new event when a customer is charged. Webhook of type \"paid\" must be created in Payhip Developer settings. [See the documentation](https://help.payhip.com/article/115-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(event) {
      return event.type === "paid";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `${event.email} charged $${event.price}`,
        ts: event.date,
      };
    },
  },
  sampleEmit,
};
