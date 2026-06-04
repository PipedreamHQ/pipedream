import app from "../../deel.app.mjs";

export default {
  key: "deel-get-eor-contract-form",
  name: "Get EOR Contract Form",
  description:
    "Retrieve the EOR contract form field definitions for a specific country, including field names,"
    + " types, validation rules, and required vs optional fields."
    + " Use this to understand exactly what data is needed before creating an EOR contract."
    + " `country_code` must be an ISO 3166-1 alpha-2 code (e.g., `DE` for Germany, `GB` for UK)."
    + " [See the documentation](https://developer.deel.com/docs/get-eor-contract-form)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      path: `/forms/eor/create-contract/${this.countryCode}`,
    });

    $.export("$summary", `Retrieved EOR contract form fields for ${this.countryCode}`);
    return response;
  },
};
