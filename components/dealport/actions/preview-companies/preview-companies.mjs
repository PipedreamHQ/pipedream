import app from "../../dealport.app.mjs";

export default {
  key: "dealport-preview-companies",
  name: "Preview Market ($0.00)",
  description: "Size a US private company market for free ($0.00) and inspect 5 sample companies before unlocking paid Records. [See the documentation](https://app.dealport.com/llms.txt)",
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
  },
  async run({ $ }) {
    const response = await this.app.previewCompanies({
      $,
      data: {
        q: this.q,
        state: this.state,
        cities: this.cities,
        counties: this.counties,
        naics: this.naics,
        domain: this.domain,
        min_employees: this.minEmployees,
        max_employees: this.maxEmployees,
        min_revenue: this.minRevenue,
        max_revenue: this.maxRevenue,
        independent: this.independent,
      },
    });
    const total = response?.total ?? response?.total_count ?? response?.count ?? 0;
    $.export("$summary", `Previewed ${total} matching US companies ($0.00)`);
    return response;
  },
};
