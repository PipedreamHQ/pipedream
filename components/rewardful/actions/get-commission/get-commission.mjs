import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-get-commission",
  name: "Get Commission",
  description: "Retrieve a single commission by ID, including its amount in cents, state, due and paid dates, campaign, and sale. Use **List Commissions** to find the commission ID. [See the documentation](https://developers.rewardful.com/rest-api/commissions/retrieve)",
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
    commissionId: {
      propDefinition: [
        rewardful,
        "commissionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.getCommission({
      $,
      commissionId: this.commissionId,
    });
    $.export("$summary", `Successfully retrieved commission ${this.commissionId}`);
    return response;
  },
};
