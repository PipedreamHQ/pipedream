import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-swift-code-lookup",
  name: "Lookup SWIFT Code Details",
  description: "Fetches detailed information about a SWIFT code. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    swiftCode: {
      type: "string",
      label: "Swiftcode",
      description: "SWIFT/BIC code to lookup (must be 8 or 11 characters).",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/swift-code/lookup",
      params: {
        swiftCode: this.swiftCode,
      },
    });
    $.export("$summary", "Successfully executed Lookup SWIFT Code Details");
    return response;
  },
};
