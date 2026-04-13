import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-people",
  name: "Search People",
  description: "Search business professionals by name, title, department, seniority, or company. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/people/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      description: "Full or partial name of the person to search for",
      optional: true,
    },
    peopleTitles: {
      type: "string[]",
      label: "Job Titles",
      description: "Job titles",
      optional: true,
    },
    peoples: {
      type: "string[]",
      label: "People IDs",
      description: "People UUIDs",
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
      type: "integer[]",
      label: "Employees",
      description: "Employee range (e.g. `[1, 10]`)",
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
      type: "string[]",
      label: "Company LinkedIn URLs",
      description: "Company LinkedIn URLs",
      optional: true,
    },
    linkedinUrls: {
      type: "string[]",
      label: "LinkedIn URLs",
      description: "Person LinkedIn URLs",
      optional: true,
    },
    companies: {
      type: "string[]",
      label: "Companies",
      description: "Company UUIDs",
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
    if (this.peopleTitles?.length) data.people_titles = this.peopleTitles;
    if (this.peoples?.length) data.peoples = this.peoples;
    if (this.managementLevels?.length) data.management_levels = this.managementLevels;
    if (this.departments?.length) data.departments = this.departments;
    if (this.departmentFunctions?.length) data.department_functions = this.departmentFunctions;
    if (this.employees?.length) {
      if (this.employees.length !== 2) {
        throw new Error("Employees must be a range of exactly 2 values: [min, max]");
      }
      data.employees = this.employees;
    }
    if (this.peopleLocations?.length) data.people_locations = this.peopleLocations;
    if (this.companyLocations?.length) data.company_locations = this.companyLocations;
    if (this.companyLinkedinUrls?.length) data.company_linkedin_urls = this.companyLinkedinUrls;
    if (this.linkedinUrls?.length) data.linkedin_urls = this.linkedinUrls;
    if (this.companies?.length) data.companies = this.companies;
    if (this.domains?.length) data.domains = this.domains;
    const response = await this.pubrio.searchPeople({
      $,
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} people`);
    return response;
  },
};
