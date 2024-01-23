import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-refunds",
  name: "List Refunds",
  type: "action",
  version: "0.1.0",
  description: "Find or list refunds. [See the docs](https://stripe.com/docs/api/refunds/list) " +
    "for more information",
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
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "charge",
      "payment_intent",
    ]);
    const resp = await this.app.sdk().refunds.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${resp.length} refund${resp.length === 1 ? "" : "s"}`);
    return resp;
  },
};
