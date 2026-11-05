import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-country-details",
  name: "Get GeoDB Country Details",
  description: "Get GeoDB Country Details [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/country/details",
      params: {
        country: this.country,
      },
    });
    $.export("$summary", "Successfully executed Get GeoDB Country Details");
    return response;
  },
};
