import { ConfigurationError } from "@pipedream/platform";
import {
  MAX_PAGE,
  PAGE_SIZE,
} from "../../common/constants.mjs";
import { buildCompanyInclude } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-and-enrich-companies",
  name: "Search and Enrich Companies",
  description: "Search Lusha's company database with prospecting filters, then enrich every match to reveal full company data, up to `Limit` companies. Enrichment is billed per successful result, so set `Limit` to cap credit usage. To preview matches without enriching, use **Search Companies** instead. [See the documentation](https://docs.lusha.com/api-reference/prospecting/prospecting-companies)",
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

    const companies = [];
    let page = 0;
    let hasMore;

    do {
      const remaining = this.limit - companies.length;
      const { results = [] } = await this.lusha.searchCompanies({
        $,
        data: {
          pagination: {
            page,
            size: PAGE_SIZE,
          },
          filters: {
            companies: {
              include,
            },
          },
        },
      });

      const ids = results
        .slice(0, remaining)
        .map(({ id }) => id)
        .filter(Boolean);

      if (ids.length) {
        const { results: enriched = [] } = await this.lusha.enrichCompanies({
          $,
          data: {
            ids,
          },
        });
        companies.push(...enriched);
      }

      hasMore = results.length === PAGE_SIZE
        && companies.length < this.limit
        && page < MAX_PAGE;
      page++;
    } while (hasMore);

    $.export("$summary", `Found and enriched ${companies.length} companies`);
    return companies;
  },
};
