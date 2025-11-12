import { PAYMENT_STATUSES } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "digitalriver-new-payment-status-updated",
  name: "New Payment Status Updated (Instant)",
  description: "Emit new event each time the payment status of an order is updated in Digital River.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTypes() {
      return PAYMENT_STATUSES;
    },
    getSummary(body) {
      return `Payment status updated for order ${body.data.object.id}`;
    },
  },
  sampleEmit,
};
