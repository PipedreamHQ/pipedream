import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-vat-rates-country",
  name: "Bulk VAT Lookup by Country",
  description: "Retrieves VAT details for multiple countries or country-state combinations in a single request. Maximum of `100` entries per request are allowed. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/vat/rates/country",
    });
    $.export("$summary", "Successfully executed Bulk VAT Lookup by Country");
    return response;
  },
};
