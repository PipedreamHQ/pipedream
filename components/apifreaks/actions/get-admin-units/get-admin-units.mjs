import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-admin-units",
  name: "Get Administrative Units for a Country",
  description: "Retrieve administrative units based on ISO 3166-1 alpha-2 country code. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/admin-levels",
      params: {
        country: this.country,
      },
    });
    $.export("$summary", "Successfully executed Get Administrative Units for a Country");
    return response;
  },
};
