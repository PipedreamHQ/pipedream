import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geo-admin-units",
  name: "Get Administrative Units by Country",
  description: "Retrieve administrative divisions for a given country using ISO 3166-1 alpha-2 country codes. You can optionally filter by administrative levels. [See the documentation](https://apifreaks.com/docs).",
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
    adminLevels: {
      type: "string",
      label: "Adminlevels",
      description: "Comma-separated list to filter results by one or more administrative levels.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/admin-units",
      params: {
        country: this.country,
        adminLevels: this.adminLevels,
      },
    });
    $.export("$summary", "Successfully executed Get Administrative Units by Country");
    return response;
  },
};
