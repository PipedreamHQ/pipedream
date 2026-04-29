import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-refunds",
  name: "List Refunds",
  type: "action",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find or list refunds. [See the documentation](https://stripe.com/docs/api/refunds/list).",
  props: {
    app,
    charge: {
      propDefinition: [
        app,
        "charge",
      ],
    },
    paymentIntent: {
      propDefinition: [
        app,
        "paymentIntent",
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
      charge,
      paymentIntent,
      limit,
      endingBefore,
      startingAfter,
    } = this;

    const resp = await app.sdk().refunds.list({
      charge,
      payment_intent: paymentIntent,
      limit,
      ending_before: endingBefore,
      starting_after: startingAfter,
    });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${resp.data.length} refund${resp.data.length === 1 ? "" : "s"}${resp.has_more ? " (more available)" : ""}`);
    return resp;
  },
};
