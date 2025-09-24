import lusha from "../../lusha.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "lusha-search-and-enrich-companies",
  name: "Search and Enrich Companies",
  description: "Search for companies and enrich them. [See the documentation](https://docs.lusha.com/apis/openapi/company-search-and-enrich)",
  version: "0.0.1",
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
    const include = {};

    if (this.names) include.names = parseObject(this.names);
    if (this.domains) include.domains = parseObject(this.domains);
    if (this.locations) include.locations = parseObject(this.locations);
    if (this.sizes) include.sizes = parseObject(this.sizes);
    if (this.revenues) include.revenues = parseObject(this.revenues);
    if (this.sicCodes) include.sicCodes = parseObject(this.sicCodes);
    if (this.naicsCodes) include.naicsCodes = parseObject(this.naicsCodes);

    const companies = [];
    let hasMore, count = 0, page = 0;

    do {
      const {
        requestId, data = [],
      } = await this.lusha.searchCompanies({
        $,
        params: {
          pages: {
            page,
            size: 50,
          },
        },
        data: {
          filters: {
            companies: {
              include,
            },
          },
        },
      });
      hasMore = data.length;
      const companyIds = [];

      for (const d of data) {
        companyIds.push(d.id);
        if (++count >= this.limit) {
          hasMore = false;
          break;
        }
      }

      const enrichedCompanies = await this.lusha.enrichCompanies({
        $,
        data: {
          requestId,
          companyIds,
        },
      });

      companies.push(...enrichedCompanies.companies);
      page++;
    } while (hasMore);

    $.export("$summary", `Found and enriched ${companies.length} companies`);
    return companies;
  },
};
