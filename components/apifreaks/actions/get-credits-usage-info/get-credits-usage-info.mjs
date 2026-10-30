import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-credits-usage-info",
  name: "Get Credits Usage Information",
  description: "Returns the remaining and consumed API credits for the authenticated user. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/credits/usage/info",
    });
    $.export("$summary", "Successfully executed Get Credits Usage Information");
    return response;
  },
};
