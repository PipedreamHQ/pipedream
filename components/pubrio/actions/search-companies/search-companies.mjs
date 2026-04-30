import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-companies",
  name: "Search Companies",
  description: "Search B2B companies by name, domain, location, industry, technology, or headcount. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    companyName: {
      propDefinition: [
        pubrio,
        "companyName",
      ],
    },
    domains: {
      propDefinition: [
        pubrio,
        "domains",
      ],
    },
    locations: {
      propDefinition: [
        pubrio,
        "locations",
      ],
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords",
      optional: true,
    },
    verticals: {
      type: "string[]",
      label: "Verticals",
      description: "Industry vertical names",
      optional: true,
    },
    technologies: {
      type: "string[]",
      label: "Technologies",
      description: "Technology names",
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
    linkedinUrls: {
      type: "string[]",
      label: "LinkedIn URLs",
      description: "LinkedIn company URLs",
      optional: true,
    },
    excludeLocations: {
      type: "string[]",
      label: "Exclude Locations",
      description: "ISO country codes to exclude",
      optional: true,
    },
    places: {
      type: "string[]",
      label: "Places",
      description: "Place names",
      optional: true,
    },
    excludePlaces: {
      type: "string[]",
      label: "Exclude Places",
      description: "Place names to exclude",
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
    categories: {
      type: "string[]",
      label: "Technology Categories",
      description: "Technology category IDs",
      optional: true,
    },
    companies: {
      type: "string[]",
      label: "Companies",
      description: "Company domain_search_id UUIDs",
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
    excludeFields: {
      type: "string[]",
      label: "Exclude Fields",
      description: "Field names to exclude from the response",
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
    jobExcludeLocations: {
      type: "string[]",
      label: "Job Exclude Locations",
      description: "Country codes to exclude from job locations",
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
    newsGalleries: {
      type: "string[]",
      label: "News Galleries",
      description: "News gallery slugs",
      optional: true,
    },
    newsGalleryIds: {
      type: "string[]",
      label: "News Gallery IDs",
      description: "News gallery UUIDs",
      optional: true,
    },
    advertisementSearchTerms: {
      type: "string[]",
      label: "Advertisement Search Terms",
      description: "Advertisement keywords",
      optional: true,
    },
    advertisementTargetLocations: {
      type: "string[]",
      label: "Advertisement Target Locations",
      description: "Country codes for advertisement targeting",
      optional: true,
    },
    advertisementExcludeTargetLocations: {
      type: "string[]",
      label: "Advertisement Exclude Target Locations",
      description: "Country codes to exclude from advertisement targeting",
      optional: true,
    },
    advertisementStartDateFrom: {
      type: "string",
      label: "Advertisement Start Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    advertisementStartDateTo: {
      type: "string",
      label: "Advertisement Start Date To",
      description: "End date in YYYY-MM-DD format",
      optional: true,
    },
    advertisementEndDateFrom: {
      type: "string",
      label: "Advertisement End Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    advertisementEndDateTo: {
      type: "string",
      label: "Advertisement End Date To",
      description: "End date in YYYY-MM-DD format",
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
    if (this.companyName) data.company_name = this.companyName;
    if (this.domains?.length) data.domains = this.domains;
    if (this.locations?.length) data.locations = this.locations;
    if (this.keywords?.length) data.keywords = this.keywords;
    if (this.verticals?.length) data.verticals = this.verticals;
    if (this.technologies?.length) data.technologies = this.technologies;
    if (this.employeesMin != null || this.employeesMax != null) {
      data.employees = [
        this.employeesMin ?? 1,
        this.employeesMax ?? 1000000,
      ];
    }
    if (this.linkedinUrls?.length) data.linkedin_urls = this.linkedinUrls;
    if (this.excludeLocations?.length) data.exclude_locations = this.excludeLocations;
    if (this.places?.length) data.places = this.places;
    if (this.excludePlaces?.length) data.exclude_places = this.excludePlaces;
    if (this.verticalCategories?.length) data.vertical_categories = this.verticalCategories;
    if (this.verticalSubCategories?.length) {
      data.vertical_sub_categories = this.verticalSubCategories;
    }
    if (this.categories?.length) data.categories = this.categories;
    if (this.companies?.length) data.companies = this.companies;
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
    if (this.excludeFields?.length) data.exclude_fields = this.excludeFields;
    if (this.jobTitles?.length) data.job_titles = this.jobTitles;
    if (this.jobLocations?.length) data.job_locations = this.jobLocations;
    if (this.jobExcludeLocations?.length) data.job_exclude_locations = this.jobExcludeLocations;
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
    if (this.newsGalleries?.length) data.news_galleries = this.newsGalleries;
    if (this.newsGalleryIds?.length) data.news_gallery_ids = this.newsGalleryIds;
    if (this.advertisementSearchTerms?.length) {
      data.advertisement_search_terms = this.advertisementSearchTerms;
    }
    if (this.advertisementTargetLocations?.length) {
      data.advertisement_target_locations = this.advertisementTargetLocations;
    }
    if (this.advertisementExcludeTargetLocations?.length) {
      data.advertisement_exclude_target_locations = this.advertisementExcludeTargetLocations;
    }
    if (this.advertisementStartDateFrom || this.advertisementStartDateTo) {
      data.advertisement_start_dates = [
        this.advertisementStartDateFrom ?? null,
        this.advertisementStartDateTo ?? null,
      ];
    }
    if (this.advertisementEndDateFrom || this.advertisementEndDateTo) {
      data.advertisement_end_dates = [
        this.advertisementEndDateFrom ?? null,
        this.advertisementEndDateTo ?? null,
      ];
    }
    const response = await this.pubrio.searchCompanies({
      $,
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} companies`);
    return response;
  },
};
