import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-search-news",
  name: "Search News",
  description: "Search company news and press releases. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    searchTerm: { propDefinition: [pubrio, "searchTerm"] },
    domains: { propDefinition: [pubrio, "domains"] },
    categories: {
      type: "string",
      label: "Categories",
      description: "Comma-separated news categories",
      optional: true,
    },
    publishedDates: {
      type: "string",
      label: "Published Dates",
      description: "Comma-separated published date filters",
      optional: true,
    },
    locations: { propDefinition: [pubrio, "locations"] },
    companyLocations: {
      type: "string",
      label: "Company Locations",
      description: "Comma-separated company location codes",
      optional: true,
    },
    newsGalleryIds: {
      type: "string",
      label: "News Gallery IDs",
      description: "Comma-separated news gallery IDs",
      optional: true,
    },
    newsGalleries: {
      type: "string",
      label: "News Galleries",
      description: "Comma-separated news galleries",
      optional: true,
    },
    newsLanguages: {
      type: "string",
      label: "News Languages",
      description: "Comma-separated news language codes",
      optional: true,
    },
    page: { propDefinition: [pubrio, "page"] },
    perPage: { propDefinition: [pubrio, "perPage"] },
  },
  async run({ $ }) {
    const data = { page: this.page ?? 1, per_page: this.perPage ?? 25 };
    if (this.searchTerm) data.search_term = this.searchTerm;
    if (this.domains) data.domains = this.pubrio.splitComma(this.domains);
    if (this.categories) data.categories = this.pubrio.splitComma(this.categories);
    if (this.publishedDates) data.published_dates = this.pubrio.splitComma(this.publishedDates);
    if (this.locations) data.locations = this.pubrio.splitComma(this.locations);
    if (this.companyLocations) data.company_locations = this.pubrio.splitComma(this.companyLocations);
    if (this.newsGalleryIds) data.news_gallery_ids = this.pubrio.splitComma(this.newsGalleryIds);
    if (this.newsGalleries) data.news_galleries = this.pubrio.splitComma(this.newsGalleries);
    if (this.newsLanguages) data.news_languages = this.pubrio.splitComma(this.newsLanguages);
    const response = await this.pubrio.makeRequest({ $, method: "POST", url: "/companies/news/search", data });
    $.export("$summary", `Found ${response.data?.length ?? 0} news articles`);
    return response;
  },
};
