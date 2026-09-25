import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-supported-currencies",
  name: "Get All Supported Currencies",
  description: "Returns a map of all supported currencies with metadata. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/supported",
    });
    $.export("$summary", "Successfully executed Get All Supported Currencies");
    return response;
  },
};
