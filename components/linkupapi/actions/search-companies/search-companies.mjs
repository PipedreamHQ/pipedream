import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-search-companies",
  name: "Search Companies",
  description: "Search for LinkedIn companies. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/search-companies)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    keyword: {
      propDefinition: [
        app,
        "keyword",
      ],
      description: "Free-text keyword to search companies by (e.g. company name or industry).",
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    sector: {
      type: "string[]",
      label: "Sector",
      description: "Industry sectors to filter by, passed as an array of strings.",
      optional: true,
    },
    companySize: {
      type: "string[]",
      label: "Company Size",
      description: "Company size ranges to filter by, passed as an array of strings, e.g. `[\"11-50\", \"51-200\"]`.",
      optional: true,
    },
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchCompanies({
      $,
      accountId: this.accountId,
      params: {
        keyword: this.keyword,
        location: this.location,
        sector: this.sector,
        company_size: this.companySize,
        total_results: this.totalResults,
      },
    });

    const count = response.data?.companies?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} compan${count === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
