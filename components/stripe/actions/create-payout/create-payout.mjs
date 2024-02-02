import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-payout",
  name: "Create a Payout",
  type: "action",
  version: "0.1.0",
  description: "Send funds to your own bank account. Your Stripe balance must be able to cover " +
    "the payout amount, or you'll receive an 'Insufficient Funds' error. [See the " +
    "docs](https://stripe.com/docs/api/payouts/create) for more information",
  props: {
    app,
    amount: {
      "propDefinition": [
        app,
        "amount",
      ],
      "optional": false,
    },
    currency: {
      "propDefinition": [
        app,
        "currency",
      ],
      "optional": false,
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    statement_descriptor: {
      propDefinition: [
        app,
        "statement_descriptor",
      ],
    },
    method: {
      propDefinition: [
        app,
        "payout_method",
      ],
    },
    source_type: {
      propDefinition: [
        app,
        "payout_source_type",
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
      "amount",
      "currency",
      "description",
      "statement_descriptor",
      "method",
      "source_type",
      "metadata",
    ]);
    const resp = await this.app.sdk().payouts.create(data);
    $.export("$summary", `Successfully created a new payout for ${resp.amount} of the smallest unit of currency of ${resp.currency}`);
    return resp;
  },
};
