import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-mark-payout-as-paid",
  name: "Mark Payout as Paid",
  description: "Record a payout, and every commission in it, as paid. This only updates Rewardful's records and does not send money to the affiliate. Use **List Payouts** with state `due` to find payouts ready to be paid. [See the documentation](https://developers.rewardful.com/rest-api/payouts/mark-a-payout-as-paid)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.rewardful.markPayoutAsPaid({
      $,
      payoutId: this.payoutId,
    });
    $.export("$summary", `Successfully marked payout ${this.payoutId} as paid`);
    return response;
  },
};
