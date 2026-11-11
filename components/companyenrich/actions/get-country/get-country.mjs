import companyenrich from "../../companyenrich.app.mjs";
import { countryCode } from "../../common/utils.mjs";

export default {
  key: "companyenrich-get-country",
  name: "Get Country",
  description: "Retrieve country metadata using a two-letter code from **Search Countries**. Does not consume credits. [See the documentation](https://docs.companyenrich.com/reference/get_v2-geo-countries-countrycode)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    countryCode: {
      "type": "string",
      "label": "Country Code",
      "description": "Two-letter country code, e.g. `US`. Use **Search Countries** and read the code field.",
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.getCountry({
      $,
      countryCode: countryCode(this.countryCode),
    });
    $.export("$summary", "Retrieved country metadata");
    return response;
  },
};
