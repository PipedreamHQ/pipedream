import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-payment-intents",
  name: "List Payment Intents",
  type: "action",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves a list of payment intents that were previously created. [See the documentation](https://stripe.com/docs/api/payment_intents/list).",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    endingBefore: {
      propDefinition: [
        app,
        "endingBefore",
      ],
    },
    startingAfter: {
      propDefinition: [
        app,
        "startingAfter",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      customer,
      limit,
      endingBefore,
      startingAfter,
    } = this;

    const resp = await app.sdk().paymentIntents.list({
      customer,
      limit,
      ending_before: endingBefore,
      starting_after: startingAfter,
    });
    $.export("$summary", `Successfully fetched ${resp.data.length} payment intent${resp.data.length === 1 ? "" : "s"}${resp.has_more ? " (more available)" : ""}`);
    return resp;
  },
};
