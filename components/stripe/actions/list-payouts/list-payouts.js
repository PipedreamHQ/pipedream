const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-payouts",
  name: "List Payouts",
  type: "action",
  version: "0.0.2",
  description: "Find or list payouts. [See the docs](https://stripe.com/docs/api/payouts/list) " +
    "for more information",
  props: {
    stripe,
    status: {
      propDefinition: [
        stripe,
        "payout_status",
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
      "status",
    ]);
    const resp = await this.stripe.sdk().payouts.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${params.status ? `${params.status} ` : ""}payouts`);
    return resp;
  },
};
