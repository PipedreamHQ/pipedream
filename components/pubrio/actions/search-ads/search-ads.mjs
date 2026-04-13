import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-ads",
  name: "Search Advertisements",
  description: "Search advertisements across companies. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/advertisements_search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    searchTerms: {
      type: "string[]",
      label: "Search Terms",
      description: "Search terms",
      optional: true,
    },
    targetLocations: {
      type: "string[]",
      label: "Target Locations",
      description: "Target location codes",
      optional: true,
    },
    excludeTargetLocations: {
      type: "string[]",
      label: "Exclude Target Locations",
      description: "Target location codes to exclude",
      optional: true,
    },
    headlines: {
      type: "string[]",
      label: "Headlines",
      description: "Headline keywords",
      optional: true,
    },
    startDateFrom: {
      type: "string",
      label: "Start Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    startDateTo: {
      type: "string",
      label: "Start Date To",
      description: "End date in YYYY-MM-DD format",
      optional: true,
    },
    endDateFrom: {
      type: "string",
      label: "End Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    endDateTo: {
      type: "string",
      label: "End Date To",
      description: "End date in YYYY-MM-DD format",
      optional: true,
    },
    companyLocations: {
      type: "string[]",
      label: "Company Locations",
      description: "Company location codes",
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
    if (this.searchTerms?.length) data.search_terms = this.searchTerms;
    if (this.targetLocations?.length) data.target_locations = this.targetLocations;
    if (this.excludeTargetLocations?.length) {
      data.exclude_target_locations = this.excludeTargetLocations;
    }
    if (this.headlines?.length) data.headlines = this.headlines;
    if (this.startDateFrom || this.startDateTo) {
      data.start_dates = [
        this.startDateFrom ?? null,
        this.startDateTo ?? null,
      ];
    }
    if (this.endDateFrom || this.endDateTo) {
      data.end_dates = [
        this.endDateFrom ?? null,
        this.endDateTo ?? null,
      ];
    }
    if (this.companyLocations?.length) data.company_locations = this.companyLocations;
    if (this.domains?.length) data.domains = this.domains;
    const response = await this.pubrio.searchAds({
      $,
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} advertisements`);
    return response;
  },
};
