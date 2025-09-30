import app from "../../countdown_api.app.mjs";

export default {
  key: "countdown_api-get-product-data",
  name: "Get Product Data",
  description: "Retrieves data for a specific product on eBay using the Countdown API. [See the documentation](https://www.countdownapi.com/docs/ebay-product-data-api/parameters/product)",
  version: "0.0.2",
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
        type: "product",
      },
    });

    $.export("$summary", `Retrieved product data for EPID ${this.epid}`);
    return response;
  },
};
