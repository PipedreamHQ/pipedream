const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-create-refund",
  name: "Create a Refund",
  type: "action",
  version: "0.0.1",
  description: "Creating a new refund will refund a charge that has previously been created but " +
    "not yet refunded. Funds will be refunded to the credit or debit card that was originally " +
    "charged. You can optionally refund only part of a charge. You can do so multiple times, " +
    "until the entire charge has been refunded. Once entirely refunded, a charge can't be " +
    "refunded again. ",
  props: {
    stripe,
    charge: {
      propDefinition: [
        stripe,
        "charge",
      ],
    },
    payment_intent: {
      propDefinition: [
        stripe,
        "payment_intent",
      ],
    },
    amount: {
      propDefinition: [
        stripe,
        "amount",
      ],
    },
    reason: {
      propDefinition: [
        stripe,
        "refund_reason",
      ],
    },
    refund_application_fee: {
      propDefinition: [
        stripe,
        "refund_application_fee",
      ],
    },
    reverse_transfer: {
      propDefinition: [
        stripe,
        "reverse_transfer",
      ],
    },
    metadata: {
      propDefinition: [
        stripe,
        "metadata",
      ],
    },
  },
  async run() {
    const data = pick(this, [
      "charge",
      "payment_intent",
      "amount",
      "reason",
      "refund_application_fee",
      "reverse_transfer",
      "metadata",
    ]);
    return await this.stripe.sdk().refunds.create(data);
  },
};
