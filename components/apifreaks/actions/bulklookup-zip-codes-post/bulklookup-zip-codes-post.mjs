import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-bulklookup-zip-codes-post",
  name: "Bulk Lookup Zip/Postal Codes",
  description: "Validates a bulk of ZIP/postal codes and returns result for each. Maximum \`100\` ZIP/postal codes per request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    codes: {
      type: "string",
      label: "Codes",
      description: "Comma separated list of postal / zip codes. Max. 100 values.",
      optional: false,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format. If not provided, search results will be returned from all countries.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/zipcode/lookup",
      data: {
        codes: this.codes,
        country: this.country,
      },
    });
    $.export("$summary", "Successfully executed Bulk Lookup Zip/Postal Codes");
    return response;
  },
};
