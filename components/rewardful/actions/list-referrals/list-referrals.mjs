import rewardful from "../../rewardful.app.mjs";
import constants from "../../common/constants.mjs";
import { getItems } from "../../common/utils.mjs";

export default {
  key: "rewardful-list-referrals",
  name: "List Referrals",
  description: "List referrals (visitors who arrived through an affiliate link), most recently created first. Filter by affiliate, conversion state (`visitor`, `lead`, `conversion`), email, Stripe customer ID, or an update date range. Use **List Affiliates** to find affiliate IDs. [See the documentation](https://developers.rewardful.com/rest-api/referrals/list)",
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
      description: "Only return referrals for this affiliate, e.g. `aaac9869-4242-4db9-afb1-f3518ef627c5`. Use **List Affiliates** to find it (the `id` field).",
      optional: true,
    },
    conversionStates: {
      type: "string[]",
      label: "Conversion States",
      description: "Only return referrals in these conversion states. Any of `visitor`, `lead`, `conversion`, e.g. `[\"lead\", \"conversion\"]`.",
      options: constants.CONVERSION_STATES,
      optional: true,
    },
    email: {
      propDefinition: [
        rewardful,
        "email",
      ],
      description: "Only return referrals with this email address, e.g. `customer@example.com`.",
      optional: true,
    },
    stripeCustomerId: {
      propDefinition: [
        rewardful,
        "stripeCustomerId",
      ],
      description: "Only return referrals with this Stripe customer ID, e.g. `cus_ABC123`. Found on the customer's page in the Stripe dashboard.",
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "Only return referrals updated after this ISO 8601 timestamp, e.g. `2026-01-01T00:00:00Z`. Combine with `updatedUntil` for a date range.",
      optional: true,
    },
    updatedUntil: {
      type: "string",
      label: "Updated Until",
      description: "Only return referrals updated before this ISO 8601 timestamp, e.g. `2026-01-31T23:59:59Z`. Combine with `updatedSince` for a date range.",
      optional: true,
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
      description: "Related objects to include as nested objects in each result. Any of `affiliate`, e.g. `[\"affiliate\"]`.",
      options: [
        "affiliate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rewardful.listReferrals({
      $,
      params: {
        affiliate_id: this.affiliateId,
        conversion_state: this.conversionStates,
        email: this.email,
        stripe_customer_id: this.stripeCustomerId,
        updated_since: this.updatedSince,
        updated_until: this.updatedUntil,
        page: this.page,
        limit: this.limit,
        expand: this.expand,
      },
    });
    const count = getItems(response).length;
    $.export("$summary", `Successfully retrieved ${count} referral${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
