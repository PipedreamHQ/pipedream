import rewardful from "../../rewardful.app.mjs";
import { getItems } from "../../common/utils.mjs";

export default {
  key: "rewardful-list-affiliate-coupons",
  name: "List Affiliate Coupons",
  description: "List affiliate coupons, optionally filtered by affiliate, with each coupon's code and lead and conversion counts. Use the returned `id` with **Get Affiliate Coupon**. [See the documentation](https://developers.rewardful.com/rest-api/affiliate-coupons/list-affiliate-coupons)",
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
      description: "Only return coupons for this affiliate, e.g. `aaac9869-4242-4db9-afb1-f3518ef627c5`. Use **List Affiliates** to find it (the `id` field).",
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
  },
  async run({ $ }) {
    const response = await this.rewardful.listAffiliateCoupons({
      $,
      params: {
        affiliate_id: this.affiliateId,
        page: this.page,
        limit: this.limit,
      },
    });
    const count = getItems(response).length;
    $.export("$summary", `Successfully retrieved ${count} affiliate coupon${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
