import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-payment-intent",
  name: "Create a Payment Intent",
  type: "action",
  version: "0.1.2",
  description: "Create a [payment intent](https://stripe.com/docs/payments/payment-intents). [See" +
    "the docs](https://stripe.com/docs/api/payment_intents/create) for more information",
  props: {
    app,
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
      optional: false,
    },
    currency: {
      propDefinition: [
        app,
        "currency",
        ({ country }) => ({
          country,
        }),
      ],
      optional: false,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
      optional: false,
    },
    paymentMethodTypes: {
      propDefinition: [
        app,
        "paymentMethodTypes",
      ],
      default: [
        "card",
      ],
    },
    statementDescriptor: {
      propDefinition: [
        app,
        "statementDescriptor",
      ],
    },
    statementDescriptorSuffix: {
      propDefinition: [
        app,
        "statementDescriptorSuffix",
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
    const {
      app,
      amount,
      currency,
      country,
      paymentMethodTypes,
      statementDescriptor,
      statementDescriptorSuffix,
      metadata,
    } = this;

    const resp = await app.sdk().paymentIntents.create({
      amount,
      currency,
      country,
      metadata,
      payment_method_types: paymentMethodTypes,
      ...(statementDescriptor && {
        statement_descriptor: statementDescriptor?.slice(0, 21) || undefined,
      }),
      ...(statementDescriptorSuffix && {
        statement_descriptor_suffix: statementDescriptorSuffix?.slice(0, 21) || undefined,
      }),
    });
    $.export("$summary", `Successfully created a new payment intent for ${resp.amount} of the smallest currency unit of ${resp.currency}`);
    return resp;
  },
};
