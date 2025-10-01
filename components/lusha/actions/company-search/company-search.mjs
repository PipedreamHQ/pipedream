import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-company-search",
  name: "Search Companies",
  description: "Search for companies using various filters. [See the documentation](https://docs.lusha.com/apis/openapi/company-search-and-enrich/searchprospectingcompanies)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      propDefinition: [
        lusha,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    try {
      const include = {};

      if (this.names) include.names = parseObject(this.names);
      if (this.domains) include.domains = parseObject(this.domains);
      if (this.locations) include.locations = parseObject(this.locations);
      if (this.sizes) include.sizes = parseObject(this.sizes);
      if (this.revenues) include.revenues = parseObject(this.revenues);
      if (this.sicCodes) include.sicCodes = parseObject(this.sicCodes);
      if (this.naicsCodes) include.naicsCodes = parseObject(this.naicsCodes);

      const response = this.lusha.paginate({
        $,
        maxResults: this.limit,
        fn: this.lusha.searchCompanies,
        data: {
          filters: {
            companies: {
              include,
            },
          },
        },
      });

      const responseArray = [];

      for await (const item of response) {
        responseArray.push(item);
      }

      $.export("$summary", `Successfully retrieved ${responseArray.length} companies`);
      return responseArray;
    } catch (error) {
      $.export("$summary", "Failed to search companies");
      throw error;
    }
  },
};
