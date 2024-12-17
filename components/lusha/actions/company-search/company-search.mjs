import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-company-search",
  name: "Search Companies",
  description: "Search for companies using various filters. [See the documentation](https://www.lusha.com/docs/#contactcompany-search)",
  version: "0.0.1",
  type: "action",
  props: {
    lusha,
    names: {
      propDefinition: [
        lusha,
        "companyNames",
      ],
      optional: true,
    },
    domains: {
      propDefinition: [
        lusha,
        "domains",
      ],
      optional: true,
    },
    locations: {
      propDefinition: [
        lusha,
        "locations",
      ],
      optional: true,
    },
    sizes: {
      propDefinition: [
        lusha,
        "sizes",
      ],
      optional: true,
    },
    revenues: {
      propDefinition: [
        lusha,
        "revenues",
      ],
      optional: true,
    },
    sicCodes: {
      propDefinition: [
        lusha,
        "sicCodes",
      ],
      optional: true,
    },
    naicsCodes: {
      propDefinition: [
        lusha,
        "naicsCodes",
      ],
      optional: true,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "The maximum number of results to return. **This feature is used to avoid timeouts due to very long returns.**",
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
