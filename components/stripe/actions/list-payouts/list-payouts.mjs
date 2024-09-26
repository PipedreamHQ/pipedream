import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-payouts",
  name: "List Payouts",
  type: "action",
  version: "0.1.0",
  description: "Find or list payouts. [See the docs](https://stripe.com/docs/api/payouts/list) " +
    "for more information",
  props: {
    app,
    status: {
      propDefinition: [
        app,
        "payout_status",
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
      "status",
    ]);
    const resp = await this.app.sdk().payouts.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${params.status ? `${params.status} ` : ""}payouts`);
    return resp;
  },
};
