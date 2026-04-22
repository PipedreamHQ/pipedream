import usps from "../../usps.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "usps-get-letter-prices",
  name: "Get Letter Prices",
  description: "Returns an eligible price given a set of package rate ingredients. [See the documentation](https://developer.usps.com/api/73#tag/resources/operation/post-letter-rates-search)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    usps,
    packageRateIngredients: {
      propDefinition: [
        usps,
        "packageRateIngredients",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.usps.getLetterRates({
      packageRateIngredients: this.packageRateIngredients,
    });

    $.export("$summary", "Successfully retrieved eligible price for the letter");
    return response;
  },
};
