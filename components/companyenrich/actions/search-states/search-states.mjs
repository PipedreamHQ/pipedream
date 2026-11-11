import companyenrich from "../../companyenrich.app.mjs";
import {
  stringValue, integerValue, stringArray, countryCode,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-search-states",
  name: "Search States",
  description: "Search states by a case-insensitive name substring. Returns one cursor page without consuming credits. Use returned codes or IDs in search filters. [See the documentation](https://docs.companyenrich.com/reference/post_v2-geo-states)",
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
    pageSize: {
      propDefinition: [
        companyenrich,
        "pageSize",
      ],
    },
    cursor: {
      propDefinition: [
        companyenrich,
        "cursor",
      ],
      description: "Opaque nextCursor from **Search States**, e.g. `eyJ...`. Keep the same filters; expires after 30 minutes. Omit for the first page.",
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.searchStates({
      $,
      data: {
        query: stringValue(this.query, "Query", 100),
        pageSize: integerValue(this.pageSize, "Page Size", 1, 100, 10),
        cursor: stringValue(this.cursor, "Cursor", 2048),
        countryCodes: stringArray(this.countryCodes, "Country Codes", 0, 250)?.map(countryCode),
      },
    });
    $.export("$summary", `Retrieved ${response.items?.length ?? 0} states in one page`);
    return response;
  },
};
