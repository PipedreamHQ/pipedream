import rewardful from "../../rewardful.app.mjs";
import { getItems } from "../../common/utils.mjs";

export default {
  key: "rewardful-list-affiliates",
  name: "List Affiliates",
  description: "List affiliates, most recently created first, optionally filtered by campaign, email, or Stripe customer ID. Use the returned `id` with **Get Affiliate**, **Update Affiliate**, **Get Affiliate Magic Link**, or as `affiliateId` in other tools. [See the documentation](https://developers.rewardful.com/rest-api/affiliates/list)",
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
    campaignId: {
      propDefinition: [
        rewardful,
        "campaignId",
      ],
      description: "Only return affiliates in this campaign, e.g. `c3482343-8680-40c5-af9a-9efa119713b5`. Use **List Campaigns** to find it (the `id` field).",
      optional: true,
    },
    email: {
      propDefinition: [
        rewardful,
        "email",
      ],
      description: "Only return the affiliate with this email address, e.g. `james@example.com`.",
      optional: true,
    },
    stripeCustomerId: {
      propDefinition: [
        rewardful,
        "stripeCustomerId",
      ],
      description: "Only return the customer referrer with this Stripe customer ID, e.g. `cus_ABC123`. Found on the customer's page in the Stripe dashboard.",
    },
    page: {
      propDefinition: [
        rewardful,
        "page",
      ],
    },
    limit: {
      propDefinition: [
        rewardful,
        "limit",
      ],
    },
    expand: {
      propDefinition: [
        rewardful,
        "expand",
      ],
      description: "Related objects to include as nested objects in each result. Any of `campaign`, `links`, `commission_stats`, e.g. `[\"campaign\"]`.",
      options: [
        "campaign",
        "links",
        "commission_stats",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.listAffiliates({
      $,
      params: {
        campaign_id: this.campaignId,
        email: this.email,
        stripe_customer_id: this.stripeCustomerId,
        page: this.page,
        limit: this.limit,
        expand: this.expand,
      },
    });
    const count = getItems(response).length;
    $.export("$summary", `Successfully retrieved ${count} affiliate${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
