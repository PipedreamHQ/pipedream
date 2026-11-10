import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-update-affiliate",
  name: "Update Affiliate",
  description: "Update an affiliate's details, state, campaign, or payout addresses. Only the fields provided are changed. Set `affiliateState` to `disabled` to stop tracking an affiliate, or set `campaignId` to move them to another campaign. Use **List Affiliates** to find the affiliate ID. [See the documentation](https://developers.rewardful.com/rest-api/affiliates/update)",
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
    firstName: {
      propDefinition: [
        rewardful,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        rewardful,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        rewardful,
        "email",
      ],
      optional: true,
    },
    campaignId: {
      propDefinition: [
        rewardful,
        "campaignId",
      ],
      description: "The campaign to move the affiliate to, e.g. `c3482343-8680-40c5-af9a-9efa119713b5`. Use **List Campaigns** to find it (the `id` field).",
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
    receiveNewCommissionNotifications: {
      type: "boolean",
      label: "Receive New Commission Notifications",
      description: "Whether the affiliate receives emails when they earn new commissions, e.g. `true`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.updateAffiliate({
      $,
      affiliateId: this.affiliateId,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        campaign_id: this.campaignId,
        state: this.affiliateState,
        stripe_customer_id: this.stripeCustomerId,
        paypal_email: this.paypalEmail,
        wise_email: this.wiseEmail,
        receive_new_commission_notifications: this.receiveNewCommissionNotifications,
      },
    });
    $.export("$summary", `Successfully updated affiliate ${this.affiliateId}`);
    return response;
  },
};
