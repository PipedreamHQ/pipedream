import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-commodity-symbols",
  name: "Get All Supported Commodity Symbols",
  description: "Returns the list of supported commodity symbols with metadata. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/commodity/symbols",
    });
    $.export("$summary", "Successfully executed Get All Supported Commodity Symbols");
    return response;
  },
};
