import app from "../../deel.app.mjs";

export default {
  key: "deel-get-eor-benefits",
  name: "Get EOR Benefits",
  description:
    "List available EOR (employer of record) benefits offered through Deel, optionally filtered by country."
    + " Returns benefit names, types, descriptions, and country availability."
    + " Use this when a user asks about what benefits they can offer EOR employees in a specific country."
    + " `country` must be an ISO 3166-1 alpha-2 code (e.g., `DE` for Germany, `US` for United States)."
    + " [See the documentation](https://developer.deel.com/docs/list-eor-benefits)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    country: {
      type: "string",
      label: "Country",
      description: "Filter benefits by country. ISO 3166-1 alpha-2 code (e.g., `DE`, `US`, `GB`). Omit to list all countries.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.country) params.country = this.country;

    const response = await this.app._makeRequest({
      $,
      path: "/eor/benefits",
      params,
    });

    const benefits = response?.data ?? response ?? [];
    const countryLabel = this.country
      ? ` in ${this.country}`
      : "";
    $.export("$summary", `Retrieved ${Array.isArray(benefits)
      ? benefits.length
      : 0} EOR benefits${countryLabel}`);
    return response;
  },
};
