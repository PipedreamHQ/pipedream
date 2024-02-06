import pickBy from "lodash.pickby";
import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-payment-intent",
  name: "Update a Payment Intent",
  type: "action",
  version: "0.1.0",
  description: "Update a [payment intent](https://stripe.com/docs/payments/payment-intents). [See" +
    " the docs](https://stripe.com/docs/api/payment_intents/update) for more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "payment_intent",
      ],
      optional: false,
    },
    amount: {
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
    },
    currency: {
      propDefinition: [
        app,
        "currency",
        ({ country }) => ({
          country,
        }),
      ],
      default: "", // currency cannot be used when modifying a PaymentIntent that was created by an invoice
    },
    payment_method_types: {
      propDefinition: [
        app,
        "payment_method_types",
      ],
    },
    statement_descriptor: {
      propDefinition: [
        app,
        "statement_descriptor",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
    advanced: {
      propDefinition: [
        app,
        "metadata",
      ],
      label: "Advanced Options",
      description: "Specify less-common options that you require. See [Update a PaymentIntent]" +
        "(https://stripe.com/docs/api/payment_intents/update) for a list of supported options.",
    },
  },
  async run({ $ }) {
    const params = {
      ...pick(this, [
        "amount",
        "payment_method_types",
        "metadata",
      ]),
      // Include these props only if truthy since they're required in payment intent
      ...pickBy(pick(this, [
        "currency",
        "statement_descriptor",
      ])),
    };
    const advanced = this.advanced;

    // Don't fail if the statement descriptor was too long
    if (params.statement_descriptor) {
      params.statement_descriptor = String(params.statement_descriptor).slice(0, 21);
    }
    if (advanced?.statement_descriptor_suffix) {
      advanced.statement_descriptor_suffix = String(advanced.statement_descriptor_suffix)
        .slice(0, 21);
    }
    const resp = await this.app.sdk().paymentIntents.update(this.id, {
      ...params,
      ...advanced,
    });
    $.export("$summary", `Successfully updated the payment intent, "${resp.description || resp.id}"`);
    return resp;
  },
};
