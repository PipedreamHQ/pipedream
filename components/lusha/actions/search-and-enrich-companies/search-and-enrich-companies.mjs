import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-and-enrich-companies",
  name: "Search and Enrich Companies",
  description: "Search for companies and enrich them. [See the documentation](https://docs.lusha.com/apis/openapi/company-search-and-enrich)",
  version: "0.0.4",
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
    const {
      lusha,
      names,
      domains,
      locations,
      sizes,
      revenues,
      sicCodes,
      naicsCodes,
    } = this;

    const include = {
      ...(names
        ? {
          names: parseObject(names),
        }
        : undefined
      ),
      ...(domains
        ? {
          domains: parseObject(domains),
        }
        : undefined
      ),
      ...(locations
        ? {
          locations: parseObject(locations).map((country) => ({
            country,
          })),
        }
        : undefined
      ),
      ...(sizes
        ? {
          sizes: parseObject(sizes),
        }
        : undefined
      ),
      ...(revenues
        ? {
          revenues: parseObject(revenues),
        }
        : undefined
      ),
      ...(sicCodes
        ? {
          sicCodes: parseObject(sicCodes),
        }
        : undefined
      ),
      ...(naicsCodes
        ? {
          naicsCodes: parseObject(naicsCodes),
        }
        : undefined
      ),
    };

    if (Object.keys(include).length === 0) {
      throw new Error("At least one company filter must be provided");
    }

    const companies = [];
    let hasMore, count = 0, page = 0;

    do {
      const {
        requestId, data = [],
      } = await lusha.searchCompanies({
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
      const companiesIds = [];

      for (const d of data) {
        companiesIds.push(d.id);
        if (++count >= this.limit) {
          hasMore = false;
          break;
        }
      }

      const enrichedCompanies = await this.lusha.enrichCompanies({
        $,
        data: {
          requestId,
          companiesIds,
        },
      });

      companies.push(...enrichedCompanies.companies);
      page++;
    } while (hasMore);

    $.export("$summary", `Found and enriched ${companies.length} companies`);
    return companies;
  },
};
