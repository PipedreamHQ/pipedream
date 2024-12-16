import lusha from "../../lusha.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lusha-company-search",
  name: "Search Companies",
  description: "Search for companies using various filters. [See the documentation](https://www.lusha.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lusha,
    searchCompanyNames: {
      propDefinition: [
        lusha,
        "searchCompanyNames",
      ],
    },
    searchCompanyDomains: {
      propDefinition: [
        lusha,
        "searchCompanyDomains",
      ],
    },
    searchCompanyLocations: {
      propDefinition: [
        lusha,
        "searchCompanyLocations",
      ],
    },
    searchCompanySizes: {
      propDefinition: [
        lusha,
        "searchCompanySizes",
      ],
    },
    searchCompanyRevenues: {
      propDefinition: [
        lusha,
        "searchCompanyRevenues",
      ],
    },
    searchCompanySicCodes: {
      propDefinition: [
        lusha,
        "searchCompanySicCodes",
      ],
    },
    searchCompanyNaicsCodes: {
      propDefinition: [
        lusha,
        "searchCompanyNaicsCodes",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.lusha.searchCompanies({
        searchCompanyNames: this.searchCompanyNames,
        searchCompanyDomains: this.searchCompanyDomains,
        searchCompanyLocations: this.searchCompanyLocations,
        searchCompanySizes: this.searchCompanySizes,
        searchCompanyRevenues: this.searchCompanyRevenues,
        searchCompanySicCodes: this.searchCompanySicCodes,
        searchCompanyNaicsCodes: this.searchCompanyNaicsCodes,
      });

      const totalResults = response.totalResults;
      $.export("$summary", `Successfully retrieved ${totalResults} companies`);
      return response;
    } catch (error) {
      $.export("$summary", "Failed to search companies");
      throw error;
    }
  },
};
