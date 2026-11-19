import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-get-affiliate-link",
  name: "Get Affiliate Link",
  description: "Retrieve a single affiliate link by ID, including its URL, token, and visitor, lead, and conversion counts. Use **List Affiliate Links** to find the link ID. [See the documentation](https://developers.rewardful.com/rest-api/affiliate-links/retrieve)",
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
    affiliateLinkId: {
      propDefinition: [
        rewardful,
        "affiliateLinkId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.getAffiliateLink({
      $,
      affiliateLinkId: this.affiliateLinkId,
    });
    $.export("$summary", `Successfully retrieved affiliate link ${response.url ?? this.affiliateLinkId}`);
    return response;
  },
};
