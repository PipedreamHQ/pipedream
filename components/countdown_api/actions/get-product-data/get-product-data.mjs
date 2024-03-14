import countdownApi from "../../countdown_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "countdown_api-get-product-data",
  name: "Get Product Data",
  description: "Retrieves data for a specific product on eBay using the Countdown API. [See the documentation](https://www.countdownapi.com/docs/ebay-product-data-api/parameters/product)",
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
        (c) => ({
          defaultValue: c.type === "product"
            ? "product"
            : undefined,
        }),
      ],
      default: "product",
      options: [
        {
          label: "Product",
          value: "product",
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.countdownApi.getProductData({
      epid: this.epid,
      ebay_domain: this.ebayDomain,
      type: this.type,
    });

    $.export("$summary", `Retrieved product data for EPID ${this.epid}`);
    return response;
  },
};
