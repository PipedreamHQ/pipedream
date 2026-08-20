import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geo-regions",
  name: "Get GeoDB Regions",
  description: "Get GeoDB Regions [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/geo/regions",
    });
    $.export("$summary", "Successfully executed Get GeoDB Regions");
    return response;
  },
};
