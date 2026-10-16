import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-update-affiliate-link",
  name: "Update Affiliate Link",
  description: "Change the token of an existing affiliate link, which changes the link's URL. Links shared with the old token stop being attributed to the affiliate. Use **List Affiliate Links** to find the link ID. [See the documentation](https://developers.rewardful.com/rest-api/affiliate-links/update)",
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
    affiliateLinkId: {
      propDefinition: [
        rewardful,
        "affiliateLinkId",
      ],
    },
    token: {
      propDefinition: [
        rewardful,
        "token",
      ],
      description: "The new code for the link, e.g. `jb007` produces links like `?via=jb007`. Must contain only letters, numbers, and dashes.",
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.updateAffiliateLink({
      $,
      affiliateLinkId: this.affiliateLinkId,
      data: {
        token: this.token,
      },
    });
    $.export("$summary", `Successfully updated affiliate link ${this.affiliateLinkId}`);
    return response;
  },
};
