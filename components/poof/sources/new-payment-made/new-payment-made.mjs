import common from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "poof-new-payment-made",
  name: "New Payment Made",
  description: "Emit new events when a payment is made in Poof. [See the documentation](https://docs.poof.io/reference/notifications-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    paymentTypes: {
      type: "string[]",
      label: "Payment Type(s)",
      description: "Filter incoming events by payment type",
      options() {
        const paymentTypes = [];
        for (const [
          key,
          value,
        ] of Object.entries(constants.PAYMENT_TYPES)) {
          paymentTypes.push({
            value: key,
            label: value,
          });
        }
        return paymentTypes;
      },
    },
  },
  methods: {
    ...common.methods,
    isRelevant(payment) {
      return this.paymentTypes.includes(payment.paid);
    },
    generateMeta(payment) {
      return {
        id: payment.payment_id,
        summary: `New ${constants.PAYMENT_TYPES[payment.paid]}`,
        ts: Date.now(),
      };
    },
  },
};
