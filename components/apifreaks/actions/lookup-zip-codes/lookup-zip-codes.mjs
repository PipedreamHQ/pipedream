import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-lookup-zip-codes",
  name: "Lookup Zip/Postal Codes",
  description: "Lookup ZIP/postal codes [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    code: {
      type: "string",
      label: "Code",
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
      method: "GET",
      path: "/v1.0/zipcode/lookup",
      params: {
        code: this.code,
        country: this.country,
      },
    });
    $.export("$summary", "Successfully executed Lookup Zip/Postal Codes");
    return response;
  },
};
