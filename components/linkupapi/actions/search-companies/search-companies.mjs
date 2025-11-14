import app from "../../linkupapi.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "linkupapi-search-companies",
  name: "Search Companies",
  description: "Search for companies on LinkedIn based on criteria. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Companies/search)",
  version: "0.0.1",
  props: {
    app,
    loginToken: {
      propDefinition: [
        app,
        "loginToken",
      ],
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Search keyword for company filtering",
      optional: true,
    },
    location: {
      description: "Geographic locations to filter companies",
      propDefinition: [
        app,
        "location",
      ],
    },
    sector: {
      type: "string[]",
      label: "Sector",
      description: "Industry sector you can [find the label here](https://learn.microsoft.com/en-us/linkedin/shared/references/reference-tables/industry-codes-v2)",
      optional: true,
    },
    companySize: {
      type: "string",
      label: "Company Size",
      description: "Employee count range: 1-10 employees 11-50 employees 51-200 employees 201-500 employees 501-1000 employees 1001-5000 employees 5001-10000 employees 10001+ employees",
      optional: true,
      options: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1001-5000",
        "5001-10000",
        "10001+",
      ],
    },
    totalResults: {
      type: "integer",
      label: "Total Results",
      description: "Number of companies to retrieve when not in pagination mode (default: 10)",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      loginToken,
      country,
      keyword,
      location,
      sector,
      companySize,
      totalResults,
    } = this;

    const response = await this.app.searchCompanies({
      $,
      data: {
        login_token: loginToken,
        country,
        keyword,
        location: utils.getOptionalProp(location),
        sector: utils.getOptionalProp(sector),
        company_size: companySize,
        total_results: totalResults,
      },
    });

    $.export("$summary", "Successfully retrieved companies");
    return response;
  },
};
