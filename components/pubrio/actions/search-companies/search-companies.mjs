import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-companies",
  name: "Search Companies",
  description: "Search B2B companies by name, domain, location, industry, technology, or headcount. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
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
    linkedinUrls: {
      type: "string",
      label: "LinkedIn URLs",
      description: "Comma-separated LinkedIn company URLs",
      optional: true,
    },
    excludeLocations: {
      type: "string",
      label: "Exclude Locations",
      description: "Comma-separated ISO country codes to exclude",
      optional: true,
    },
    places: {
      type: "string",
      label: "Places",
      description: "Comma-separated place names",
      optional: true,
    },
    excludePlaces: {
      type: "string",
      label: "Exclude Places",
      description: "Comma-separated place names to exclude",
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
    categories: {
      type: "string",
      label: "Technology Categories",
      description: "Comma-separated technology category IDs",
      optional: true,
    },
    companies: {
      type: "string",
      label: "Companies",
      description: "Comma-separated company domain_search_id UUIDs",
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
      type: "string",
      label: "Exclude Fields",
      description: "Comma-separated field names to exclude from the response",
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
    jobExcludeLocations: {
      type: "string",
      label: "Job Exclude Locations",
      description: "Comma-separated country codes to exclude from job locations",
      optional: true,
    },
    jobPostedDates: {
      type: "string",
      label: "Job Posted Dates",
      description: "Comma-separated date range in YYYY-MM-DD format",
      optional: true,
    },
    newsCategories: {
      type: "string",
      label: "News Categories",
      description: "Comma-separated news category slugs",
      optional: true,
    },
    newsPublishedDates: {
      type: "string",
      label: "News Published Dates",
      description: "Comma-separated date range in YYYY-MM-DD format",
      optional: true,
    },
    newsGalleries: {
      type: "string",
      label: "News Galleries",
      description: "Comma-separated news gallery slugs",
      optional: true,
    },
    newsGalleryIds: {
      type: "string",
      label: "News Gallery IDs",
      description: "Comma-separated news gallery UUIDs",
      optional: true,
    },
    advertisementSearchTerms: {
      type: "string",
      label: "Advertisement Search Terms",
      description: "Comma-separated advertisement keywords",
      optional: true,
    },
    advertisementTargetLocations: {
      type: "string",
      label: "Advertisement Target Locations",
      description: "Comma-separated country codes for advertisement targeting",
      optional: true,
    },
    advertisementExcludeTargetLocations: {
      type: "string",
      label: "Advertisement Exclude Target Locations",
      description: "Comma-separated country codes to exclude from advertisement targeting",
      optional: true,
    },
    advertisementStartDates: {
      type: "string",
      label: "Advertisement Start Dates",
      description: "Comma-separated date range in YYYY-MM-DD format",
      optional: true,
    },
    advertisementEndDates: {
      type: "string",
      label: "Advertisement End Dates",
      description: "Comma-separated date range in YYYY-MM-DD format",
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
    if (this.domains) data.domains = this.pubrio.splitComma(this.domains);
    if (this.locations?.length) data.locations = this.locations;
    if (this.keywords) data.keywords = this.pubrio.splitComma(this.keywords);
    if (this.verticals) data.verticals = this.pubrio.splitComma(this.verticals);
    if (this.technologies) data.technologies = this.pubrio.splitComma(this.technologies);
    if (this.employeesMin != null || this.employeesMax != null) {
      data.employees = [
        this.employeesMin ?? 1,
        this.employeesMax ?? 1000000,
      ];
    }
    if (this.linkedinUrls) data.linkedin_urls = this.pubrio.splitComma(this.linkedinUrls);
    if (this.excludeLocations) data.exclude_locations = this.pubrio.splitComma(this.excludeLocations);
    if (this.places) data.places = this.pubrio.splitComma(this.places);
    if (this.excludePlaces) data.exclude_places = this.pubrio.splitComma(this.excludePlaces);
    if (this.verticalCategories) data.vertical_categories = this.pubrio.splitComma(this.verticalCategories);
    if (this.verticalSubCategories) data.vertical_sub_categories = this.pubrio.splitComma(this.verticalSubCategories);
    if (this.categories) data.categories = this.pubrio.splitComma(this.categories);
    if (this.companies) data.companies = this.pubrio.splitComma(this.companies);
    if (this.revenueMin != null) data.revenue_min = this.revenueMin;
    if (this.revenueMax != null) data.revenue_max = this.revenueMax;
    if (this.foundedYearStart != null) data.founded_year_start = this.foundedYearStart;
    if (this.foundedYearEnd != null) data.founded_year_end = this.foundedYearEnd;
    if (this.isEnableSimilaritySearch != null) data.is_enable_similarity_search = this.isEnableSimilaritySearch;
    if (this.similarityScore) data.similarity_score = this.similarityScore;
    if (this.excludeFields) data.exclude_fields = this.pubrio.splitComma(this.excludeFields);
    if (this.jobTitles) data.job_titles = this.pubrio.splitComma(this.jobTitles);
    if (this.jobLocations) data.job_locations = this.pubrio.splitComma(this.jobLocations);
    if (this.jobExcludeLocations) data.job_exclude_locations = this.pubrio.splitComma(this.jobExcludeLocations);
    if (this.jobPostedDates) data.job_posted_dates = this.pubrio.splitComma(this.jobPostedDates);
    if (this.newsCategories) data.news_categories = this.pubrio.splitComma(this.newsCategories);
    if (this.newsPublishedDates) data.news_published_dates = this.pubrio.splitComma(this.newsPublishedDates);
    if (this.newsGalleries) data.news_galleries = this.pubrio.splitComma(this.newsGalleries);
    if (this.newsGalleryIds) data.news_gallery_ids = this.pubrio.splitComma(this.newsGalleryIds);
    if (this.advertisementSearchTerms) data.advertisement_search_terms = this.pubrio.splitComma(this.advertisementSearchTerms);
    if (this.advertisementTargetLocations) data.advertisement_target_locations = this.pubrio.splitComma(this.advertisementTargetLocations);
    if (this.advertisementExcludeTargetLocations) data.advertisement_exclude_target_locations = this.pubrio.splitComma(this.advertisementExcludeTargetLocations);
    if (this.advertisementStartDates) data.advertisement_start_dates = this.pubrio.splitComma(this.advertisementStartDates);
    if (this.advertisementEndDates) data.advertisement_end_dates = this.pubrio.splitComma(this.advertisementEndDates);
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/companies/search",
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} companies`);
    return response;
  },
};
