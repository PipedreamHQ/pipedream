import printful from "../../printful.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printful-calculate-shipping-rates",
  name: "Calculate Shipping Rates",
  description: "Fetches available shipping rates for a given destination. [See the documentation](https://developers.printful.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    printful,
    shippingRecipientAddress: {
      propDefinition: [
        printful,
        "shippingRecipientAddress",
      ],
    },
    shippingProductDetails: {
      propDefinition: [
        printful,
        "shippingProductDetails",
      ],
    },
  },
  async run({ $ }) {
    const shippingRates = await this.printful.fetchShippingRates({
      shippingRecipientAddress: this.shippingRecipientAddress,
      shippingProductDetails: this.shippingProductDetails,
    });
    $.export("$summary", "Fetched shipping rates successfully");
    return shippingRates;
  },
};
