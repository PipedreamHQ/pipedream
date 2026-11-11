import companyenrich from "../../companyenrich.app.mjs";
import {
  stringValue, integerValue, stringArray, countryCode,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-search-cities",
  name: "Search Cities",
  description: "Search cities by a case-insensitive name substring. Fetches up to **Maximum Pages** without consuming credits; defaults to one page. Use returned codes or IDs in search filters. [See the documentation](https://docs.companyenrich.com/reference/post_v2-geo-cities)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    query: {
      propDefinition: [
        companyenrich,
        "query",
      ],
    },
    countryCodes: {
      propDefinition: [
        companyenrich,
        "countryCodes",
      ],
    },
    stateIds: {
      "type": "string[]",
      "label": "State IDs",
      "description": "Up to 100 positive state IDs as decimal text, e.g. `[\"123\", \"456\"]`. Use **Search States** and read each id field. Matches either state, combined with the country filter.",
      "optional": true,
    },
    pageSize: {
      propDefinition: [
        companyenrich,
        "pageSize",
      ],
    },
    maxPages: {
      propDefinition: [
        companyenrich,
        "maxPages",
      ],
      description: "Maximum geographic pages to fetch, e.g. `3`. Accepts 1 to 100; defaults to 1. These lookups consume no CompanyEnrich credits. With 1, returns the original page; with more than 1, returns `{ pages, nextCursor }`. Stops early when no next cursor remains.",
    },
    cursor: {
      propDefinition: [
        companyenrich,
        "cursor",
      ],
      description: "Opaque nextCursor from **Search Cities**, e.g. `eyJ...`. Keep the same filters; expires after 30 minutes. Omit for the first page.",
    },
  },
  async run({ $ }) {
    const stateIds = stringArray(this.stateIds, "State IDs", 0, 100)?.map((id) => {
      if (!/^[1-9]\d*$/.test(id) || Number(id) > 2147483647) {
        throw new ConfigurationError("State IDs must be positive 32-bit integers.");
      }
      return Number(id);
    });
    const response = await this.companyenrich.collectPages({
      $,
      method: "searchCities",
      maxPages: this.maxPages,
      data: {
        query: stringValue(this.query, "Query", 100),
        pageSize: integerValue(this.pageSize, "Page Size", 1, 100, 10),
        cursor: stringValue(this.cursor, "Cursor", 2048),
        countryCodes: stringArray(this.countryCodes, "Country Codes", 0, 250)?.map(countryCode),
        stateIds,
      },
    });
    const pages = response.pages ?? [
      response,
    ];
    const count = pages.reduce((total, page) => total + (page.items?.length ?? 0), 0);
    $.export("$summary", `Retrieved ${count} cities across ${pages.length} page(s)`);
    return response;
  },
};
