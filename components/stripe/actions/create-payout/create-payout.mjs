import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-payout",
  name: "Create a Payout",
  type: "action",
  version: "0.1.3",
  description: "Create a payout. [See the documentation](https://stripe.com/docs/api/payouts/create).",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Send funds to your own bank account. Your Stripe balance must be able to cover the payout amount, or you'll receive an 'Insufficient Funds' error. [See the documentation](https://stripe.com/docs/api/payouts/create).",
    },
    amount: {
      optional: false,
      propDefinition: [
        app,
        "amount",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
      optional: false,
    },
    currency: {
      optional: false,
      propDefinition: [
        app,
        "currency",
        ({ country }) => ({
          country,
        }),
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    statementDescriptor: {
      propDefinition: [
        app,
        "statementDescriptor",
      ],
    },
    method: {
      type: "string",
      label: "Method",
      description: "`instant` is only supported for payouts to debit cards",
      default: "standard",
      options: [
        "standard",
        "instant",
      ],
      optional: true,
    },
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "The balance type of your Stripe balance to draw this payout from",
      options: [
        "bank_account",
        "card",
        "fpx",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      amount,
      currency,
      description,
      statementDescriptor,
      method,
      sourceType,
      metadata,
    } = this;

    const resp = await app.sdk().payouts.create({
      amount,
      currency,
      description,
      statement_descriptor: statementDescriptor,
      method,
      source_type: sourceType,
      metadata,
    });
    $.export("$summary", `Successfully created a new payout for \`${resp.amount}\` of the smallest unit of currency of \`${resp.currency}\`.`);
    return resp;
  },
};
