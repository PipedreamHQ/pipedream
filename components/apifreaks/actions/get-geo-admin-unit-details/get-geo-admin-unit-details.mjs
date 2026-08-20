import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geo-admin-unit-details",
  name: "Get GeoDB Admin Unit Details",
  description: "Retrieve detailed administrative unit information by country and optionally filtered by admin code. [See the documentation](https://apifreaks.com/docs).",
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
      description: "Optional admin code to fetch details for a specific administrative unit.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/admin-unit/details",
      params: {
        country: this.country,
        "admin_unit": this.adminUnit,
      },
    });
    $.export("$summary", "Successfully executed Get GeoDB Admin Unit Details");
    return response;
  },
};
