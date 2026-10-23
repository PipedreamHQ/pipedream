import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-delete-commission",
  name: "Delete Commission",
  description: "Permanently delete a commission. The affiliate's and campaign's financial stats are recalculated. This cannot be undone. Use **List Commissions** to find the commission ID. [See the documentation](https://developers.rewardful.com/rest-api/commissions/delete)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.rewardful.deleteCommission({
      $,
      commissionId: this.commissionId,
    });
    $.export("$summary", `Successfully deleted commission ${this.commissionId}`);
    return response;
  },
};
