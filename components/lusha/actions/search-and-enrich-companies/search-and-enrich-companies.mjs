import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-and-enrich-companies",
  name: "Search and Enrich Companies",
  description: "Search for companies and enrich them. [See the documentation](https://docs.lusha.com/apis/openapi/company-search-and-enrich)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lusha,
    names: {
      propDefinition: [
        lusha,
        "companyNames",
      ],
    },
    domains: {
      propDefinition: [
        lusha,
        "domains",
      ],
    },
    locations: {
      propDefinition: [
        lusha,
        "locations",
      ],
    },
    sizes: {
      propDefinition: [
        lusha,
        "sizes",
      ],
    },
    revenues: {
      propDefinition: [
        lusha,
        "revenues",
      ],
    },
    sicCodes: {
      propDefinition: [
        lusha,
        "sicCodes",
      ],
    },
    naicsCodes: {
      propDefinition: [
        lusha,
        "naicsCodes",
      ],
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "The maximum number of results to return. **This feature is used to avoid timeouts due to very long returns.**",
    },
  },
  async run() {
  },
};
