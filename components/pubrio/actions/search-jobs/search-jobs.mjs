import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-jobs",
  name: "Search Jobs",
  description: "Search job postings across companies. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    searchTerm: { propDefinition: [pubrio, "searchTerm"] },
    searchTerms: {
      type: "string",
      label: "Search Terms",
      description: "Comma-separated search terms",
      optional: true,
    },
    titles: {
      type: "string",
      label: "Titles",
      description: "Comma-separated job titles",
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
    locations: { propDefinition: [pubrio, "locations"] },
    excludeLocations: {
      type: "string",
      label: "Exclude Locations",
      description: "Comma-separated location codes to exclude",
      optional: true,
    },
    companyLocations: {
      type: "string",
      label: "Company Locations",
      description: "Comma-separated company location codes",
      optional: true,
    },
    companies: {
      type: "string",
      label: "Companies",
      description: "Comma-separated company UUIDs",
      optional: true,
    },
    domains: { propDefinition: [pubrio, "domains"] },
    linkedinUrls: {
      type: "string",
      label: "LinkedIn URLs",
      description: "Comma-separated LinkedIn company URLs",
      optional: true,
    },
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
  },
  async run({ $ }) {
    const data = { page: this.page ?? 1, per_page: this.perPage ?? 25 };
    if (this.searchTerm) data.search_term = this.searchTerm;
    if (this.searchTerms) data.search_terms = this.pubrio.splitComma(this.searchTerms);
    if (this.titles) data.titles = this.pubrio.splitComma(this.titles);
    if (this.postedDateFrom || this.postedDateTo) {
      data.posted_dates = [this.postedDateFrom || this.postedDateTo, this.postedDateTo || this.postedDateFrom];
    }
    if (this.locations) data.locations = this.pubrio.splitComma(this.locations);
    if (this.excludeLocations) data.exclude_locations = this.pubrio.splitComma(this.excludeLocations);
    if (this.companyLocations) data.company_locations = this.pubrio.splitComma(this.companyLocations);
    if (this.companies) data.companies = this.pubrio.splitComma(this.companies);
    if (this.domains) data.domains = this.pubrio.splitComma(this.domains);
    if (this.linkedinUrls) data.linkedin_urls = this.pubrio.splitComma(this.linkedinUrls);
    const response = await this.pubrio.makeRequest({ $, method: "POST", url: "/companies/jobs/search", data });
    $.export("$summary", `Found ${response.data?.length ?? 0} jobs`);
    return response;
  },
};
