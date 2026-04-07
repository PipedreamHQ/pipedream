import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-find-similar-companies",
  name: "Find Similar Companies",
  description: "Find companies similar to a given company. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    lookupType: { propDefinition: [pubrio, "lookupTypeDomain"] },
    value: { propDefinition: [pubrio, "lookupValue"] },
    locations: { propDefinition: [pubrio, "locations"] },
    excludeLocations: {
      type: "string",
      label: "Exclude Locations",
      description: "Comma-separated ISO country codes to exclude",
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
    revenueMin: {
      type: "integer",
      label: "Min Revenue",
      description: "Minimum revenue",
      optional: true,
    },
    revenueMax: {
      type: "integer",
      label: "Max Revenue",
      description: "Maximum revenue",
      optional: true,
    },
    foundedYearStart: {
      type: "integer",
      label: "Founded Year Start",
      description: "Minimum founding year",
      optional: true,
    },
    foundedYearEnd: {
      type: "integer",
      label: "Founded Year End",
      description: "Maximum founding year",
      optional: true,
    },
    technologies: {
      type: "string",
      label: "Technologies",
      description: "Comma-separated technology names",
      optional: true,
    },
    categories: {
      type: "string",
      label: "Technology Categories",
      description: "Comma-separated technology category IDs",
      optional: true,
    },
    verticals: {
      type: "string",
      label: "Verticals",
      description: "Comma-separated industry vertical names",
      optional: true,
    },
    verticalCategories: {
      type: "string",
      label: "Vertical Categories",
      description: "Comma-separated vertical category IDs",
      optional: true,
    },
    verticalSubCategories: {
      type: "string",
      label: "Vertical Sub-Categories",
      description: "Comma-separated vertical sub-category IDs",
      optional: true,
    },
    jobTitles: {
      type: "string",
      label: "Job Titles",
      description: "Comma-separated job titles",
      optional: true,
    },
    jobLocations: {
      type: "string",
      label: "Job Locations",
      description: "Comma-separated country codes for job locations",
      optional: true,
    },
    jobPostedDateFrom: {
      type: "string",
      label: "Job Posted Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    jobPostedDateTo: {
      type: "string",
      label: "Job Posted Date To",
      description: "End date in YYYY-MM-DD format",
      optional: true,
    },
    newsCategories: {
      type: "string",
      label: "News Categories",
      description: "Comma-separated news category slugs",
      optional: true,
    },
    newsPublishedDateFrom: {
      type: "string",
      label: "News Published Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    newsPublishedDateTo: {
      type: "string",
      label: "News Published Date To",
      description: "End date in YYYY-MM-DD format",
      optional: true,
    },
    isEnableSimilaritySearch: {
      type: "boolean",
      label: "Enable Similarity Search",
      description: "Whether to enable similarity search",
      optional: true,
    },
    similarityScore: {
      type: "string",
      label: "Similarity Score",
      description: "Similarity score threshold (0-1)",
      optional: true,
    },
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
  },
  async run({ $ }) {
    let val = this.value;
    if (this.lookupType === "domain_id") {
      val = parseInt(this.value, 10);
      if (Number.isNaN(val)) {
        throw new Error(`domain_id must be a valid integer, got: "${this.value}"`);
      }
    }
    const data = {
      [this.lookupType]: val,
      page: this.page ?? 1,
      per_page: this.perPage ?? 25,
    };
    if (this.locations?.length) data.locations = this.locations;
    if (this.excludeLocations) data.exclude_locations = this.pubrio.splitComma(this.excludeLocations);
    if (this.employeesMin != null || this.employeesMax != null) {
      data.employees = [this.employeesMin ?? 1, this.employeesMax ?? 1000000];
    }
    if (this.revenueMin != null || this.revenueMax != null) {
      data.revenues = [this.revenueMin ?? 0, this.revenueMax ?? 999999999999];
    }
    if (this.foundedYearStart != null || this.foundedYearEnd != null) {
      data.founded_dates = [this.foundedYearStart ?? 1900, this.foundedYearEnd ?? 2100];
    }
    if (this.technologies) data.technologies = this.pubrio.splitComma(this.technologies);
    if (this.categories) data.categories = this.pubrio.splitComma(this.categories);
    if (this.verticals) data.verticals = this.pubrio.splitComma(this.verticals);
    if (this.verticalCategories) data.vertical_categories = this.pubrio.splitComma(this.verticalCategories);
    if (this.verticalSubCategories) data.vertical_sub_categories = this.pubrio.splitComma(this.verticalSubCategories);
    if (this.jobTitles) data.job_titles = this.pubrio.splitComma(this.jobTitles);
    if (this.jobLocations) data.job_locations = this.pubrio.splitComma(this.jobLocations);
    if (this.jobPostedDateFrom || this.jobPostedDateTo) {
      data.job_posted_dates = [this.jobPostedDateFrom || this.jobPostedDateTo, this.jobPostedDateTo || this.jobPostedDateFrom];
    }
    if (this.newsCategories) data.news_categories = this.pubrio.splitComma(this.newsCategories);
    if (this.newsPublishedDateFrom || this.newsPublishedDateTo) {
      data.news_published_dates = [this.newsPublishedDateFrom || this.newsPublishedDateTo, this.newsPublishedDateTo || this.newsPublishedDateFrom];
    }
    if (this.isEnableSimilaritySearch != null) data.is_enable_similarity_search = this.isEnableSimilaritySearch;
    if (this.similarityScore) data.similarity_score = this.similarityScore;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/companies/lookalikes/search",
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} similar companies`);
    return response;
  },
};
