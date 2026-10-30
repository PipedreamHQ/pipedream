import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-get-affiliate-magic-link",
  name: "Get Affiliate Magic Link",
  description: "Generate a one-time magic link (SSO URL) that logs an affiliate into their Rewardful dashboard without a password. The link is in `sso.url`, expires after one minute, and can be used once. Generating a new link invalidates earlier ones, so redirect the affiliate to it immediately rather than storing or emailing it. Use **List Affiliates** to find the affiliate ID. [See the documentation](https://developers.rewardful.com/rest-api/affiliates/sso)",
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
  },
  async run({ $ }) {
    const response = await this.rewardful.getAffiliateMagicLink({
      $,
      affiliateId: this.affiliateId,
    });
    $.export("$summary", `Successfully generated a magic link for affiliate ${this.affiliateId}`);
    return response;
  },
};
