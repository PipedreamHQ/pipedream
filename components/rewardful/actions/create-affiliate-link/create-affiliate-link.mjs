import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-create-affiliate-link",
  name: "Create Affiliate Link",
  description: "Create an additional tracking link for an existing affiliate. A unique token is generated if `token` is omitted. Use **List Affiliates** to find the affiliate ID. [See the documentation](https://developers.rewardful.com/rest-api/affiliate-links/create)",
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
    affiliateId: {
      propDefinition: [
        rewardful,
        "affiliateId",
      ],
    },
    token: {
      propDefinition: [
        rewardful,
        "token",
      ],
      description: "The code used in the link, e.g. `jb007` produces links like `?via=jb007`. Must contain only letters, numbers, and dashes. A unique token is generated if omitted.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.createAffiliateLink({
      $,
      data: {
        affiliate_id: this.affiliateId,
        token: this.token,
      },
    });
    $.export("$summary", `Successfully created affiliate link ${response.url ?? response.id}`);
    return response;
  },
};
