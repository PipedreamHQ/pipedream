import { ConfigurationError } from "@pipedream/platform";
import { buildCompanyInclude } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-company-search",
  name: "Search Companies",
  description: "Search Lusha's company database with prospecting filters (names, domains, locations, sizes, revenues, SIC and NAICS codes). Returns company previews with an `id` for each result; pass those IDs to **Enrich Companies** to reveal full company data. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-companies)",
  version: "0.1.0",
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
    const include = buildCompanyInclude(this);
    if (Object.keys(include).length === 0) {
      throw new ConfigurationError("Provide at least one company filter.");
    }

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

    const companies = [];
    for await (const item of response) {
      companies.push(item);
    }

    $.export("$summary", `Found ${companies.length} companies`);
    return companies;
  },
};
