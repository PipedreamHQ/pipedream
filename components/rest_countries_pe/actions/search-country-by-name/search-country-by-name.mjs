import countries from "../../rest_countries_pe.app.mjs";

export default {
  key: "rest_countries_pe-search-country-by-name",
  name: "Search Country By Name",
  description: "Search for a country by name. [See the docs](https://restcountries.com/#endpoints-name)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    countries,
    name: {
      type: "string",
      label: "Name",
      description: "Country name to search for",
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "Should the country name be an exact match?",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {
      fullText: this.exactMatch,
    };

    const response = await this.countries.searchByName(this.name, {
      params,
      $,
    });

    $.export("$summary", `Found ${response?.length} countr${response?.length === 1
      ? "y"
      : "ies"}.`);

    return response;
  },
};
