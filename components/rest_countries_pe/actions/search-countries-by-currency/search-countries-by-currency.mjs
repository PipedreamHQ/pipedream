import countries from "../../rest_countries_pe.app.mjs";

export default {
  key: "rest_countries_pe-search-countries-by-currency",
  name: "Search Countries By Currency",
  description: "Search for a country or countries by currency. [See the docs](https://restcountries.com/#endpoints-currency)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    countries,
    currency: {
      propDefinition: [
        countries,
        "currency",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.countries.searchByCurrency(this.currency, {
      $,
    });

    $.export("$summary", `Found ${response?.length} countr${response?.length === 1
      ? "y"
      : "ies"}.`);

    return response;
  },
};
