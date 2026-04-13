import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-jobs",
  name: "Search Jobs",
  description: "Search job postings across companies. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/job_search)",
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
    searchTerms: {
      type: "string[]",
      label: "Search Terms",
      description: "Search terms",
      optional: true,
    },
    titles: {
      type: "string[]",
      label: "Titles",
      description: "Job titles",
      optional: true,
    },
    postedDateFrom: {
      type: "string",
      label: "Posted Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    postedDateTo: {
      type: "string",
      label: "Posted Date To",
      description: "End date in YYYY-MM-DD format",
      optional: true,
    },
    locations: {
      propDefinition: [
        pubrio,
        "locations",
      ],
    },
    excludeLocations: {
      type: "string[]",
      label: "Exclude Locations",
      description: "Location codes to exclude",
      optional: true,
    },
    companyLocations: {
      type: "string[]",
      label: "Company Locations",
      description: "Company location codes",
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
    linkedinUrls: {
      type: "string[]",
      label: "LinkedIn URLs",
      description: "LinkedIn company URLs",
      optional: true,
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
    if (this.searchTerms?.length) data.search_terms = this.searchTerms;
    if (this.titles?.length) data.titles = this.titles;
    if (this.postedDateFrom || this.postedDateTo) {
      data.posted_dates = [
        this.postedDateFrom ?? null,
        this.postedDateTo ?? null,
      ];
    }
    if (this.locations?.length) data.locations = this.locations;
    if (this.excludeLocations?.length) data.exclude_locations = this.excludeLocations;
    if (this.companyLocations?.length) data.company_locations = this.companyLocations;
    if (this.companies?.length) data.companies = this.companies;
    if (this.domains?.length) data.domains = this.domains;
    if (this.linkedinUrls?.length) data.linkedin_urls = this.linkedinUrls;
    const response = await this.pubrio.searchJobs({
      $,
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} jobs`);
    return response;
  },
};
