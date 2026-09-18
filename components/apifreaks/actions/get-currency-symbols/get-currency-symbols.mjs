import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-currency-symbols",
  name: "Get All Currency Symbols",
  description: "Returns a map of currency codes to their full names. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/symbols",
    });
    $.export("$summary", "Successfully executed Get All Currency Symbols");
    return response;
  },
};
