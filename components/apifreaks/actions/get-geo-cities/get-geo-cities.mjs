import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geo-cities",
  name: "Get Cities by Country and Admin Unit",
  description: "Retrieve a list of cities within a country, optionally filtered by an administrative unit code. [See the documentation](https://apifreaks.com/docs).",
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
    adminUnit: {
      type: "string",
      label: "Admin Unit",
      description: "Administrative unit code used to filter cities within a specific region.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/cities",
      params: {
        country: this.country,
        "admin_unit": this.adminUnit,
      },
    });
    $.export("$summary", "Successfully executed Get Cities by Country and Admin Unit");
    return response;
  },
};
