import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-news-search",
  name: "News Search",
  description: "Search Google News for recent articles. Failed and empty requests are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/news)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    time: {
      propDefinition: [
        app,
        "time",
      ],
    },
    includeDomains: {
      propDefinition: [
        app,
        "includeDomains",
      ],
    },
    excludeDomains: {
      propDefinition: [
        app,
        "excludeDomains",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/news",
      data: {
        q: this.q,
        country: this.country,
        language: this.language,
        location: this.location,
        page: this.page,
        time: this.time,
        include_domains: this.includeDomains,
        exclude_domains: this.excludeDomains,
      },
    });
    $.export("$summary", `Retrieved ${response.results?.length ?? 0} results`);
    return response;
  },
};
