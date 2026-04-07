import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-people",
  name: "Search People",
  description: "Search business professionals by name, title, department, seniority, or company. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    searchTerm: {
      propDefinition: [
        pubrio,
        "searchTerm",
      ],
    },
    peopleName: {
      type: "string",
      label: "Person Name",
      optional: true,
    },
    peopleTitles: {
      type: "string",
      label: "Job Titles",
      description: "Comma-separated job titles",
      optional: true,
    },
    peoples: {
      type: "string",
      label: "People IDs",
      description: "Comma-separated people UUIDs",
      optional: true,
    },
    managementLevels: {
      propDefinition: [
        pubrio,
        "managementLevels",
      ],
    },
    departments: {
      propDefinition: [
        pubrio,
        "departments",
      ],
    },
    departmentFunctions: {
      propDefinition: [
        pubrio,
        "departmentFunctions",
      ],
    },
    employees: {
      type: "string",
      label: "Employees",
      description: "Comma-separated employee range (e.g. `1,10`)",
      optional: true,
    },
    peopleLocations: {
      propDefinition: [
        pubrio,
        "locations",
      ],
      label: "People Locations",
      description: "Location codes for people",
    },
    companyLocations: {
      propDefinition: [
        pubrio,
        "locations",
      ],
      label: "Company Locations",
      description: "Location codes for companies",
    },
    companyLinkedinUrls: {
      type: "string",
      label: "Company LinkedIn URLs",
      description: "Comma-separated company LinkedIn URLs",
      optional: true,
    },
    linkedinUrls: {
      type: "string",
      label: "LinkedIn URLs",
      description: "Comma-separated person LinkedIn URLs",
      optional: true,
    },
    companies: {
      type: "string",
      label: "Companies",
      description: "Comma-separated company UUIDs",
      optional: true,
    },
    domains: {
      propDefinition: [
        pubrio,
        "domains",
      ],
    },
    page: {
      propDefinition: [
        pubrio,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        pubrio,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      page: this.page ?? 1,
      per_page: this.perPage ?? 25,
    };
    if (this.searchTerm) data.search_term = this.searchTerm;
    if (this.peopleName) data.people_name = this.peopleName;
    if (this.peopleTitles) data.people_titles = this.pubrio.splitComma(this.peopleTitles);
    if (this.peoples) data.peoples = this.pubrio.splitComma(this.peoples);
    if (this.managementLevels?.length) data.management_levels = this.managementLevels;
    if (this.departments?.length) data.departments = this.departments;
    if (this.departmentFunctions?.length) data.department_functions = this.departmentFunctions;
    if (this.employees) data.employees = this.pubrio.splitComma(this.employees).map(Number);
    if (this.peopleLocations?.length) data.people_locations = this.peopleLocations;
    if (this.companyLocations?.length) data.company_locations = this.companyLocations;
    if (this.companyLinkedinUrls) data.company_linkedin_urls = this.pubrio.splitComma(this.companyLinkedinUrls);
    if (this.linkedinUrls) data.linkedin_urls = this.pubrio.splitComma(this.linkedinUrls);
    if (this.companies) data.companies = this.pubrio.splitComma(this.companies);
    if (this.domains) data.domains = this.pubrio.splitComma(this.domains);
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/people/search",
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} people`);
    return response;
  },
};
