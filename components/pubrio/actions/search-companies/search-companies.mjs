import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-companies",
  name: "Search Companies",
  description: "Search B2B companies by name, domain, location, industry, technology, or headcount. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    companyName: { propDefinition: [pubrio, "companyName"] },
    domains: { propDefinition: [pubrio, "domains"] },
    locations: { propDefinition: [pubrio, "locations"] },
    keywords: {
      type: "string",
      label: "Keywords",
      description: "Comma-separated keywords",
      optional: true,
    },
    verticals: {
      type: "string",
      label: "Verticals",
      description: "Comma-separated industry verticals",
      optional: true,
    },
    technologies: {
      type: "string",
      label: "Technologies",
      description: "Comma-separated technologies",
      optional: true,
    },
    employeesMin: {
      type: "integer",
      label: "Min Employees",
      optional: true,
    },
    employeesMax: {
      type: "integer",
      label: "Max Employees",
      optional: true,
    },
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
  },
  async run({ $ }) {
    const data = {
      page: this.page ?? 1,
      per_page: this.perPage ?? 25,
    };
    if (this.companyName) data.company_name = this.companyName;
    if (this.domains) data.domains = this.pubrio.splitComma(this.domains);
    if (this.locations) data.locations = this.pubrio.splitComma(this.locations);
    if (this.keywords) data.keywords = this.pubrio.splitComma(this.keywords);
    if (this.verticals) data.verticals = this.pubrio.splitComma(this.verticals);
    if (this.technologies) data.technologies = this.pubrio.splitComma(this.technologies);
    if (this.employeesMin != null || this.employeesMax != null) {
      data.employees = [this.employeesMin ?? 1, this.employeesMax ?? 1000000];
    }
    const response = await this.pubrio.makeRequest({ $, method: "POST", url: "/companies/search", data });
    $.export("$summary", `Found ${response.data?.length ?? 0} companies`);
    return response;
  },
};
