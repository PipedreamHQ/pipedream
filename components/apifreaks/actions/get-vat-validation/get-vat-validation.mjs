import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-vat-validation",
  name: "Validate EU and UK VAT Number",
  description: "Validates an EU or UK VAT number and returns registration status details. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    vatNumber: {
      type: "string",
      label: "Vatnumber",
      description: "EU or UK VAT number to validate.",
      optional: false,
    },
    requesterVatNumber: {
      type: "string",
      label: "Requestervatnumber",
      description: "Requester EU or UK VAT number.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/vat/validation",
      params: {
        vatNumber: this.vatNumber,
        requesterVatNumber: this.requesterVatNumber,
      },
    });
    $.export("$summary", "Successfully executed Validate EU and UK VAT Number");
    return response;
  },
};
