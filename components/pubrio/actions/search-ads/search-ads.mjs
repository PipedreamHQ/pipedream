import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-ads",
  name: "Search Advertisements",
  description: "Search advertisements across companies. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    searchTerms: {
      type: "string",
      label: "Search Terms",
      description: "Comma-separated search terms",
      optional: true,
    },
    targetLocations: {
      type: "string",
      label: "Target Locations",
      description: "Comma-separated target location codes",
      optional: true,
    },
    excludeTargetLocations: {
      type: "string",
      label: "Exclude Target Locations",
      description: "Comma-separated target location codes to exclude",
      optional: true,
    },
    headlines: {
      type: "string",
      label: "Headlines",
      description: "Comma-separated headline keywords",
      optional: true,
    },
    startDates: {
      type: "string",
      label: "Start Dates",
      description: "Comma-separated start date filters",
      optional: true,
    },
    endDates: {
      type: "string",
      label: "End Dates",
      description: "Comma-separated end date filters",
      optional: true,
    },
    companyLocations: {
      type: "string",
      label: "Company Locations",
      description: "Comma-separated company location codes",
      optional: true,
    },
    domains: { propDefinition: [pubrio, "domains"] },
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
  },
  async run({ $ }) {
    const data = { page: this.page ?? 1, per_page: this.perPage ?? 25 };
    if (this.searchTerms) data.search_terms = this.pubrio.splitComma(this.searchTerms);
    if (this.targetLocations) data.target_locations = this.pubrio.splitComma(this.targetLocations);
    if (this.excludeTargetLocations) data.exclude_target_locations = this.pubrio.splitComma(this.excludeTargetLocations);
    if (this.headlines) data.headlines = this.pubrio.splitComma(this.headlines);
    if (this.startDates) data.start_dates = this.pubrio.splitComma(this.startDates);
    if (this.endDates) data.end_dates = this.pubrio.splitComma(this.endDates);
    if (this.companyLocations) data.company_locations = this.pubrio.splitComma(this.companyLocations);
    if (this.domains) data.domains = this.pubrio.splitComma(this.domains);
    const response = await this.pubrio.makeRequest({ $, method: "POST", url: "/companies/advertisements/search", data });
    $.export("$summary", `Found ${response.data?.length ?? 0} advertisements`);
    return response;
  },
};
