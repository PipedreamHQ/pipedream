import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whop-new-payment-succeeded-instant",
  name: "New Payment Succeeded (Instant)",
  description: "Emit new event when your company receives a successful payment. [See the documentation](https://dev.whop.com/api-reference/v2/webhooks/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "payment_succeeded",
      ];
    },
    getSummary({ id }) {
      return `New payment succeeded with id ${id}`;
    },
  },
  sampleEmit,
};
