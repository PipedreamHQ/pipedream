import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-news",
  name: "Search News",
  description: "Search company news and press releases. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/news_search)",
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
    domains: {
      propDefinition: [
        pubrio,
        "domains",
      ],
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "News categories",
      optional: true,
    },
    publishedDateFrom: {
      type: "string",
      label: "Published Date From",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    publishedDateTo: {
      type: "string",
      label: "Published Date To",
      description: "End date in YYYY-MM-DD format",
      optional: true,
    },
    locations: {
      propDefinition: [
        pubrio,
        "locations",
      ],
    },
    companyLocations: {
      type: "string[]",
      label: "Company Locations",
      description: "Company location codes",
      optional: true,
    },
    newsGalleryIds: {
      type: "string[]",
      label: "News Gallery IDs",
      description: "News gallery IDs",
      optional: true,
    },
    newsGalleries: {
      type: "string[]",
      label: "News Galleries",
      description: "News galleries",
      optional: true,
    },
    newsLanguages: {
      type: "string[]",
      label: "News Languages",
      description: "News language codes",
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
    if (this.domains?.length) data.domains = this.domains;
    if (this.categories?.length) data.categories = this.categories;
    if (this.publishedDateFrom || this.publishedDateTo) {
      data.published_dates = [
        this.publishedDateFrom ?? null,
        this.publishedDateTo ?? null,
      ];
    }
    if (this.locations?.length) data.locations = this.locations;
    if (this.companyLocations?.length) data.company_locations = this.companyLocations;
    if (this.newsGalleryIds?.length) data.news_gallery_ids = this.newsGalleryIds;
    if (this.newsGalleries?.length) data.news_galleries = this.newsGalleries;
    if (this.newsLanguages?.length) data.news_languages = this.newsLanguages;
    const response = await this.pubrio.searchNews({
      $,
      data,
    });
    $.export("$summary", `Found ${response.data?.length ?? 0} news articles`);
    return response;
  },
};
