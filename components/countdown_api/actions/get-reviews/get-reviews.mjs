import app from "../../countdown_api.app.mjs";

export default {
  key: "countdown_api-get-reviews",
  name: "Get Product Reviews",
  description: "Retrieves customer reviews for a specific product on eBay. [See the documentation](https://www.countdownapi.com/docs/ebay-product-data-api/parameters/reviews)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    epid: {
      propDefinition: [
        app,
        "epid",
      ],
    },
    ebayDomain: {
      propDefinition: [
        app,
        "ebayDomain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getData({
      $,
      params: {
        epid: this.epid,
        ebay_domain: this.ebayDomain,
        type: "reviews",
      },
    });

    $.export("$summary", `Retrieved reviews for product with EPID ${this.epid}`);
    return response;
  },
};
