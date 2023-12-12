const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-refunds",
  name: "List Refunds",
  type: "action",
  version: "0.0.2",
  description: "Find or list refunds. [See the docs](https://stripe.com/docs/api/refunds/list) " +
    "for more information",
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
    limit: {
      propDefinition: [
        stripe,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "charge",
      "payment_intent",
    ]);
    const resp = await this.stripe.sdk().refunds.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${resp.length} refund${resp.length === 1 ? "" : "s"}`);
    return resp;
  },
};
