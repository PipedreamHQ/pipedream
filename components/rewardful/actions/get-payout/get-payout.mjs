import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-get-payout",
  name: "Get Payout",
  description: "Retrieve a single payout by ID, including its amount in cents, state, and affiliate. Use **List Payouts** to find the payout ID. [See the documentation](https://developers.rewardful.com/rest-api/payouts/retrieve-a-payout)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rewardful,
    payoutId: {
      propDefinition: [
        rewardful,
        "payoutId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.getPayout({
      $,
      payoutId: this.payoutId,
    });
    $.export("$summary", `Successfully retrieved payout ${this.payoutId}`);
    return response;
  },
};
