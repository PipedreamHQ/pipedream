import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-vat-supported-countries",
  name: "Get Supported Countries",
  description: "Retrieves a list of supported countries. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "Type of supported country. Supported values: IBAN, SWIFT, VAT. By default, it returns all supported countries for all types.",
      optional: true,
      options: ["IBAN","SWIFT","VAT"],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/vat/supported-countries",
      params: {
        type: this.type,
      },
    });
    $.export("$summary", "Successfully executed Get Supported Countries");
    return response;
  },
};
