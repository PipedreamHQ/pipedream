import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-search-zip-by-region",
  name: "Search ZIP Codes by Region",
  description: "Search ZIP codes by region [See the documentation](https://apifreaks.com/docs).",
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
    region: {
      type: "string",
      label: "Region",
      description: "Name of the region, state or province associated with the country.",
      optional: false,
    },
    page: {
      type: "string",
      label: "Page",
      description: "Page no. to retrieve paginated results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/zipcode/search/region",
      params: {
        country: this.country,
        region: this.region,
        page: this.page,
      },
    });
    $.export("$summary", "Successfully executed Search ZIP Codes by Region");
    return response;
  },
};
