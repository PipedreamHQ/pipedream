import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-find-similar-companies",
  name: "Find Similar Companies",
  description: "Find companies similar to a given company. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/similar)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    lookupType: {
      propDefinition: [
        pubrio,
        "lookupTypeDomain",
      ],
    },
    value: {
      propDefinition: [
        pubrio,
        "lookupValue",
      ],
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
      description: "ISO country codes to exclude",
      optional: true,
    },
    employeesMin: {
      type: "integer",
      label: "Min Employees",
      description: "Minimum number of employees",
      optional: true,
    },
    employeesMax: {
      type: "integer",
      label: "Max Employees",
      description: "Maximum number of employees",
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
      type: "string[]",
      label: "Technologies",
      description: "Technology names",
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Technology Categories",
      description: "Technology category IDs",
      optional: true,
    },
    verticals: {
      type: "string[]",
      label: "Verticals",
      description: "Industry vertical names",
      optional: true,
    },
    verticalCategories: {
      type: "string[]",
      label: "Vertical Categories",
      description: "Vertical category IDs",
      optional: true,
    },
    verticalSubCategories: {
      type: "string[]",
      label: "Vertical Sub-Categories",
      description: "Vertical sub-category IDs",
      optional: true,
    },
    jobTitles: {
      type: "string[]",
      label: "Job Titles",
      description: "Job titles",
      optional: true,
    },
    jobLocations: {
      type: "string[]",
      label: "Job Locations",
      description: "Country codes for job locations",
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
      type: "string[]",
      label: "News Categories",
      description: "News category slugs",
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
    let val = this.value;
    if (this.lookupType === "domain_id") {
      if (!/^\d+$/.test(this.value)) {
        throw new Error(`domain_id must be a valid integer, got: "${this.value}"`);
      }
      val = parseInt(this.value, 10);
    }
    const data = {
      [this.lookupType]: val,
      page: this.page ?? 1,
      per_page: this.perPage ?? 25,
    };
    if (this.locations?.length) data.locations = this.locations;
    if (this.excludeLocations?.length) data.exclude_locations = this.excludeLocations;
    if (this.employeesMin != null || this.employeesMax != null) {
      data.employees = [
        this.employeesMin ?? 1,
        this.employeesMax ?? 1000000,
      ];
    }
    if (this.revenueMin != null || this.revenueMax != null) {
      data.revenues = [
        this.revenueMin ?? 0,
        this.revenueMax ?? 999999999999,
      ];
    }
    if (this.foundedYearStart != null || this.foundedYearEnd != null) {
      data.founded_dates = [
        this.foundedYearStart ?? 1900,
        this.foundedYearEnd ?? 2100,
      ];
    }
    if (this.technologies?.length) data.technologies = this.technologies;
    if (this.categories?.length) data.categories = this.categories;
    if (this.verticals?.length) data.verticals = this.verticals;
    if (this.verticalCategories?.length) data.vertical_categories = this.verticalCategories;
    if (this.verticalSubCategories?.length) {
      data.vertical_sub_categories = this.verticalSubCategories;
    }
    if (this.jobTitles?.length) data.job_titles = this.jobTitles;
    if (this.jobLocations?.length) data.job_locations = this.jobLocations;
    if (this.jobPostedDateFrom || this.jobPostedDateTo) {
      data.job_posted_dates = [
        this.jobPostedDateFrom ?? null,
        this.jobPostedDateTo ?? null,
      ];
    }
    if (this.newsCategories?.length) data.news_categories = this.newsCategories;
    if (this.newsPublishedDateFrom || this.newsPublishedDateTo) {
      data.news_published_dates = [
        this.newsPublishedDateFrom ?? null,
        this.newsPublishedDateTo ?? null,
      ];
    }
    if (this.isEnableSimilaritySearch != null) {
      data.is_enable_similarity_search = this.isEnableSimilaritySearch;
    }
    if (this.similarityScore != null && this.similarityScore !== "") {
      const score = parseFloat(this.similarityScore);
      if (Number.isNaN(score) || score < 0 || score > 1) {
        throw new Error(`similarity_score must be a number between 0 and 1, got: "${this.similarityScore}"`);
      }
      data.similarity_score = score;
    }
    const response = await this.pubrio.findSimilarCompanies({
      $,
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} similar companies`);
    return response;
  },
};
