import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickfunnels-new-subscription-invoice-paid-instant",
  name: "New Subscription Invoice Paid (Instant)",
  description: "Emit new event when a subscription fee is paid by a customer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "subscription.invoice.paid",
      ];
    },
    getSummary(body) {
      return `New subscription invoice with Id: ${body.data.id} paid successfully!`;
    },
  },
  sampleEmit,
};
