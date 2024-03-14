import countdownApi from "../../countdown_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "countdown_api-get-reviews",
  name: "Get Product Reviews",
  description: "Retrieves customer reviews for a specific product on eBay. [See the documentation](https://www.countdownapi.com/docs/ebay-product-data-api/parameters/reviews)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    countdownApi,
    epid: {
      propDefinition: [
        countdownApi,
        "epid",
      ],
    },
    ebayDomain: {
      propDefinition: [
        countdownApi,
        "ebay_domain",
      ],
    },
    type: {
      propDefinition: [
        countdownApi,
        "type",
      ],
      default: "reviews",
      options: [
        {
          label: "Reviews",
          value: "reviews",
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.countdownApi.getProductReviews({
      epid: this.epid,
      ebay_domain: this.ebayDomain,
      type: this.type,
    });

    $.export("$summary", `Retrieved reviews for product with EPID ${this.epid}`);
    return response;
  },
};
