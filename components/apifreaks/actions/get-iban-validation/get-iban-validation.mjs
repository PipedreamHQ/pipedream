import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-iban-validation",
  name: "Validate IBAN",
  description: "Checks an IBAN for structural validity, checksum accuracy, and bank metadata. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    iban: {
      type: "string",
      label: "Iban",
      description: "IBAN to validate.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/iban/validation",
      params: {
        iban: this.iban,
      },
    });
    $.export("$summary", "Successfully executed Validate IBAN");
    return response;
  },
};
