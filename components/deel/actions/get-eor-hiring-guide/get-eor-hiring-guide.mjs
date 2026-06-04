import app from "../../deel.app.mjs";

export default {
  key: "deel-get-eor-hiring-guide",
  name: "Get EOR Hiring Guide",
  description:
    "Retrieve the mandatory fields, compliance requirements, and hiring constraints for creating an"
    + " EOR (employer of record) contract in a specific country."
    + " Use this before creating an EOR contract to understand what information is required and what"
    + " restrictions apply (e.g., minimum salary, mandatory benefits, work visa rules)."
    + " `country_code` must be an ISO 3166-1 alpha-2 code (e.g., `DE` for Germany, `GB` for UK, `US` for United States)."
    + " [See the documentation](https://developer.deel.com/docs/get-eor-validations)",
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
      path: `/eor/validations/${this.countryCode}`,
    });

    $.export("$summary", `Retrieved EOR hiring guide for ${this.countryCode}`);
    return response;
  },
};
