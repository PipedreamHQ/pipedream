import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-refunds",
  name: "List Refunds",
  type: "action",
  version: "0.1.3",
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
  },
  async run({ $ }) {
    const {
      app,
      charge,
      paymentIntent,
      limit,
    } = this;

    const resp = await app.sdk().refunds.list({
      charge,
      payment_intent: paymentIntent,
    })
      .autoPagingToArray({
        limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${resp.length} refund${resp.length === 1 ? "" : "s"}`);
    return resp;
  },
};
