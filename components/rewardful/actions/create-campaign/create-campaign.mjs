import { ConfigurationError } from "@pipedream/platform";
import rewardful from "../../rewardful.app.mjs";

export default {
  key: "rewardful-create-campaign",
  name: "Create Campaign",
  description: "Create a new affiliate campaign. Set `rewardType` to `percent` with `commissionPercent`, or to `amount` with `commissionAmountCents` and `commissionAmountCurrency`. Use **Update Campaign** to change it later and **Create Affiliate** to add affiliates to it. [See the documentation](https://developers.rewardful.com/rest-api/campaigns/create-campaign)",
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
    name: {
      propDefinition: [
        rewardful,
        "campaignName",
      ],
    },
    url: {
      propDefinition: [
        rewardful,
        "campaignUrl",
      ],
    },
    rewardType: {
      propDefinition: [
        rewardful,
        "rewardType",
      ],
    },
    commissionPercent: {
      propDefinition: [
        rewardful,
        "commissionPercent",
      ],
    },
    commissionAmountCents: {
      propDefinition: [
        rewardful,
        "commissionAmountCents",
      ],
    },
    commissionAmountCurrency: {
      propDefinition: [
        rewardful,
        "commissionAmountCurrency",
      ],
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
    },
    stripeCouponId: {
      propDefinition: [
        rewardful,
        "stripeCouponId",
      ],
    },
  },
  async run({ $ }) {
    if (this.rewardType === "percent" && !this.commissionPercent) {
      throw new ConfigurationError("`commissionPercent` is required when `rewardType` is `percent`.");
    }
    if (this.rewardType === "amount" && (!this.commissionAmountCents || !this.commissionAmountCurrency)) {
      throw new ConfigurationError("`commissionAmountCents` and `commissionAmountCurrency` are required when `rewardType` is `amount`.");
    }
    const response = await this.rewardful.createCampaign({
      $,
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
    $.export("$summary", `Successfully created campaign ${response.id}`);
    return response;
  },
};
