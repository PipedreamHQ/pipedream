import app from "../../contactout.app.mjs";

export default {
  key: "contactout-company-search",
  name: "Company Search",
  description: "Get company profiles matching the search criteria. [See the documentation](https://api.contactout.com/#company-search-api).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string[]",
      label: "Company Names",
      description: "Array of company names to search for (max 50)",
      optional: true,
    },
    domain: {
      type: "string[]",
      label: "Company Domains",
      description: "Array of company domains to search for (max 50)",
      optional: true,
    },
    size: {
      propDefinition: [
        app,
        "companySize",
      ],
      description: "Company size by number of employees",
    },
    hqOnly: {
      type: "boolean",
      label: "Headquarters Only",
      description: "Filter search locations by headquarters only",
      optional: true,
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
      description: "Array of locations to search for (max 50)",
    },
    industries: {
      propDefinition: [
        app,
        "industry",
      ],
      description: "Array of industries to search for (max 50)",
    },
    minRevenue: {
      label: "Minimum Revenue",
      description: "Minimum revenue of the company",
      propDefinition: [
        app,
        "revenue",
      ],
    },
    maxRevenue: {
      label: "Maximum Revenue",
      description: "Maximum revenue of the company",
      propDefinition: [
        app,
        "revenue",
      ],
    },
    yearFoundedFrom: {
      type: "integer",
      label: "Year Founded From",
      description: "Minimum year founded of the company (min: `1985`)",
      optional: true,
      min: 1985,
    },
    yearFoundedTo: {
      type: "integer",
      label: "Year Founded To",
      description: "Maximum year founded of the company (requires Year Founded From)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      domain,
      size,
      hqOnly,
      location,
      industries,
      minRevenue,
      maxRevenue,
      yearFoundedFrom,
      yearFoundedTo,
    } = this;

    const response = await this.app.searchCompanies({
      $,
      data: {
        name,
        domain,
        size,
        hq_only: hqOnly,
        location,
        industries,
        min_revenue: minRevenue,
        max_revenue: maxRevenue,
        year_founded_from: yearFoundedFrom,
        year_founded_to: yearFoundedTo,
      },
    });

    $.export("$summary", "Successfully searched for companies");
    return response;
  },
};
