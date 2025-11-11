import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-company-search",
  name: "Search Companies",
  description: "Search for companies using various filters. [See the documentation](https://docs.lusha.com/apis/openapi/company-search-and-enrich/searchprospectingcompanies)",
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

    const response = await lusha.searchCompanies({
      $,
      data: {
        filters: {
          companies: {
            include,
          },
        },
      },
    });

    $.export("$summary", "Successfully searched for companies");

    return response;
  },
};
