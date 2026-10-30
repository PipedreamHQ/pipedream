import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-get-affiliate",
  name: "Get Affiliate",
  description: "Retrieve a single affiliate by ID, including their state, campaign, links, and payout details. Use **List Affiliates** to find the affiliate ID, for example by email. [See the documentation](https://developers.rewardful.com/rest-api/affiliates/retrieve)",
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
    affiliateId: {
      propDefinition: [
        rewardful,
        "affiliateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.getAffiliate({
      $,
      affiliateId: this.affiliateId,
    });
    $.export("$summary", `Successfully retrieved affiliate ${response.email ?? this.affiliateId}`);
    return response;
  },
};
