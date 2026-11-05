import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-subregions-by-region",
  name: "Get Subregions by Region",
  description: "Get Subregions by Region [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    region: {
      type: "string",
      label: "Region",
      description: "Name of the region.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/subregions",
      params: {
        region: this.region,
      },
    });
    $.export("$summary", "Successfully executed Get Subregions by Region");
    return response;
  },
};
