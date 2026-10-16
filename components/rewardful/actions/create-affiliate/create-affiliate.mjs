import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-create-affiliate",
  name: "Create Affiliate",
  description: "Create a new affiliate. The affiliate joins your default campaign unless `campaignId` is set. Use **List Campaigns** to find campaign IDs and **Create Affiliate Link** to give the affiliate additional links. [See the documentation](https://developers.rewardful.com/rest-api/affiliates/create)",
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
    firstName: {
      propDefinition: [
        rewardful,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        rewardful,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        rewardful,
        "email",
      ],
    },
    campaignId: {
      propDefinition: [
        rewardful,
        "campaignId",
      ],
      description: "The campaign to add the affiliate to, e.g. `c3482343-8680-40c5-af9a-9efa119713b5`. Defaults to your default campaign. Use **List Campaigns** to find it (the `id` field).",
      optional: true,
    },
    token: {
      propDefinition: [
        rewardful,
        "token",
      ],
      description: "The code used in the affiliate's link, e.g. `jb007` produces links like `?via=jb007`. Must contain only letters, numbers, and dashes. A token is generated if omitted.",
      optional: true,
    },
    affiliateState: {
      propDefinition: [
        rewardful,
        "affiliateState",
      ],
    },
    stripeCustomerId: {
      propDefinition: [
        rewardful,
        "stripeCustomerId",
      ],
      description: "For customer referral programs, the Stripe customer that receives account credits as rewards, e.g. `cus_ABC123`. The customer must exist in your Stripe account in live mode.",
    },
    paypalEmail: {
      propDefinition: [
        rewardful,
        "paypalEmail",
      ],
    },
    wiseEmail: {
      propDefinition: [
        rewardful,
        "wiseEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.createAffiliate({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        campaign_id: this.campaignId,
        token: this.token,
        state: this.affiliateState,
        stripe_customer_id: this.stripeCustomerId,
        paypal_email: this.paypalEmail,
        wise_email: this.wiseEmail,
      },
    });
    $.export("$summary", `Successfully created affiliate ${response.id}`);
    return response;
  },
};
