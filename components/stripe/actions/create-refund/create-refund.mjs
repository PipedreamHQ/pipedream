import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-refund",
  name: "Create a Refund",
  type: "action",
  version: "0.1.0",
  description: "Creating a new refund will refund a charge that has previously been created but " +
    "not yet refunded. Funds will be refunded to the credit or debit card that was originally " +
    "charged. You can optionally refund only part of a charge. You can do so multiple times, " +
    "until the entire charge has been refunded. Once entirely refunded, a charge can't be " +
    "refunded again. [See the docs](https://stripe.com/docs/api/refunds/create) for more " +
    "information",
  props: {
    app,
    charge: {
      propDefinition: [
        app,
        "charge",
      ],
    },
    payment_intent: {
      propDefinition: [
        app,
        "payment_intent",
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    reason: {
      propDefinition: [
        app,
        "refund_reason",
      ],
    },
    refund_application_fee: {
      propDefinition: [
        app,
        "refund_application_fee",
      ],
    },
    reverse_transfer: {
      propDefinition: [
        app,
        "reverse_transfer",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const data = pick(this, [
      "charge",
      "payment_intent",
      "amount",
      "reason",
      "refund_application_fee",
      "reverse_transfer",
      "metadata",
    ]);
    const resp = await this.app.sdk().refunds.create(data);
    $.export("$summary", `Successfully created a refund for ${resp.amount} of the smallest currency unit of ${resp.currency}`);
    return resp;
  },
};
