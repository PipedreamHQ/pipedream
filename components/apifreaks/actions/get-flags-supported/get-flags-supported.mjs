import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-flags-supported",
  name: "Supported Flags",
  description: "Get list of all supported flags with their metadata [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/flags/supported",
    });
    $.export("$summary", "Successfully executed Supported Flags");
    return response;
  },
};
