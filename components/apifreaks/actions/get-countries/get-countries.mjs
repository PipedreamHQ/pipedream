import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-countries",
  name: "Get List of Countries",
  description: "Retrieve countries, optionally filtered by region or subregion. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    region: {
      type: "string",
      label: "Region",
      description: "Optional filter to return countries within a specific region from the region endpoint.",
      optional: true,
    },
    subregion: {
      type: "string",
      label: "Subregion",
      description: "Optional filter to return countries within a specific subregion from the subregion endpoint.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/countries",
      params: {
        region: this.region,
        subregion: this.subregion,
      },
    });
    $.export("$summary", "Successfully executed Get List of Countries");
    return response;
  },
};
