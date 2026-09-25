import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-vat-rates-country",
  name: "Get VAT Rate by Country Code",
  description: "Fetches VAT rates for a single country or state provided via query parameters. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    country: {
      type: "string",
      label: "Country",
      description: "Country identifier in Alpha-2 (PK), Alpha-3 (PAK), or full name (Pakistan). Combine with the optional \"state\" query for sub-national VAT; values are case-insensitive and may use underscores instead of spaces.",
      optional: false,
    },
    state: {
      type: "string",
      label: "State",
      description: "Optional state or region in Alpha-2 (NY) or full name (New_York). Use with \"country\" for state-level VAT; values are case-insensitive and may use underscores.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/vat/rates/country",
      params: {
        country: this.country,
        state: this.state,
      },
    });
    $.export("$summary", "Successfully executed Get VAT Rate by Country Code");
    return response;
  },
};
