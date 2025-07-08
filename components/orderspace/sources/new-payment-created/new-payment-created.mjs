import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-new-payment-created",
  name: "New Payment Created (Instant)",
  description: "Emit new event when a payment is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "payment.created",
      ];
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: `${data.payment.reference}-${ts}`,
        summary: `Payment reference ${data.payment.reference} created`,
        ts,
      };
    },
  },
  sampleEmit,
};
