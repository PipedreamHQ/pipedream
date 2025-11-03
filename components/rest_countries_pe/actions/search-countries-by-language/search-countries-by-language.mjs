import countries from "../../rest_countries_pe.app.mjs";

export default {
  key: "rest_countries_pe-search-countries-by-language",
  name: "Search Countries By Language",
  description: "Search for a country or countries by language. [See the docs](https://restcountries.com/#endpoints-language)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    countries,
    language: {
      propDefinition: [
        countries,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.countries.searchByLanguage(this.language, {
      $,
    });

    $.export("$summary", `Found ${response?.length} countr${response?.length === 1
      ? "y"
      : "ies"}.`);

    return response;
  },
};
