import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-update-campaign",
  name: "Update Campaign",
  description: "Update an existing campaign's name, URL, privacy, or commission settings. Only the fields provided are changed. Use **List Campaigns** to find the campaign ID. [See the documentation](https://developers.rewardful.com/rest-api/campaigns/update-campaign)",
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
    campaignId: {
      propDefinition: [
        rewardful,
        "campaignId",
      ],
    },
    name: {
      propDefinition: [
        rewardful,
        "campaignName",
      ],
      optional: true,
    },
    url: {
      propDefinition: [
        rewardful,
        "campaignUrl",
      ],
      optional: true,
    },
    rewardType: {
      propDefinition: [
        rewardful,
        "rewardType",
      ],
      optional: true,
    },
    commissionPercent: {
      propDefinition: [
        rewardful,
        "commissionPercent",
      ],
      description: "The commission percentage for the campaign, e.g. `20` or `12.5`. Use when `rewardType` is `percent`.",
    },
    commissionAmountCents: {
      propDefinition: [
        rewardful,
        "commissionAmountCents",
      ],
      description: "The fixed commission amount in cents, e.g. `1500` for 15.00. Use when `rewardType` is `amount`.",
    },
    commissionAmountCurrency: {
      propDefinition: [
        rewardful,
        "commissionAmountCurrency",
      ],
      description: "The ISO 4217 currency code of the fixed commission, e.g. `USD`. Use when `rewardType` is `amount`.",
    },
    isPrivate: {
      propDefinition: [
        rewardful,
        "isPrivate",
      ],
    },
    minimumPayoutCents: {
      propDefinition: [
        rewardful,
        "minimumPayoutCents",
      ],
      description: "The minimum total of commissions, in cents of your company's display currency, an affiliate needs before receiving a payout, e.g. `5000`.",
    },
    stripeCouponId: {
      propDefinition: [
        rewardful,
        "stripeCouponId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.updateCampaign({
      $,
      campaignId: this.campaignId,
      data: {
        name: this.name,
        url: this.url,
        reward_type: this.rewardType,
        commission_percent: this.commissionPercent,
        commission_amount_cents: this.commissionAmountCents,
        commission_amount_currency: this.commissionAmountCurrency,
        private: this.isPrivate,
        minimum_payout_cents: this.minimumPayoutCents,
        stripe_coupon_id: this.stripeCouponId,
      },
    });
    $.export("$summary", `Successfully updated campaign ${this.campaignId}`);
    return response;
  },
};
