import app from "../../dealport.app.mjs";

export default {
  key: "dealport-search-companies",
  name: "Search Companies",
  description: "Search 28M+ US private companies across cited public filings ($0.01 per new Record, $0.00 repeat within 30 days). [See the documentation](https://app.dealport.com/llms.txt)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    cities: {
      propDefinition: [
        app,
        "cities",
      ],
    },
    counties: {
      propDefinition: [
        app,
        "counties",
      ],
    },
    naics: {
      propDefinition: [
        app,
        "naics",
      ],
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    minEmployees: {
      propDefinition: [
        app,
        "minEmployees",
      ],
    },
    maxEmployees: {
      propDefinition: [
        app,
        "maxEmployees",
      ],
    },
    minRevenue: {
      propDefinition: [
        app,
        "minRevenue",
      ],
    },
    maxRevenue: {
      propDefinition: [
        app,
        "maxRevenue",
      ],
    },
    independent: {
      propDefinition: [
        app,
        "independent",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchCompanies({
      $,
      params: {
        q: this.q,
        state: this.state,
        cities: Array.isArray(this.cities)
          ? this.cities.join(",")
          : this.cities,
        counties: Array.isArray(this.counties)
          ? this.counties.join(",")
          : this.counties,
        naics: Array.isArray(this.naics)
          ? this.naics.join(",")
          : this.naics,
        domain: this.domain,
        min_employees: this.minEmployees,
        max_employees: this.maxEmployees,
        min_revenue: this.minRevenue,
        max_revenue: this.maxRevenue,
        independent: this.independent,
        limit: this.limit,
        cursor: this.cursor,
      },
    });
    const items = response?.companies ?? response?.items ?? [];
    $.export("$summary", `Returned ${items.length} company Record${items.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
