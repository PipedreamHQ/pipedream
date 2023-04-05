import app from "../../world_news_api.app.mjs";

export default {
  name: "Search News",
  description: "Search and filter news. [See the docs here](https://worldnewsapi.com/docs/#Search-News). **Calling this endpoint requires 1 point**",
  key: "world_news_api-search-news",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    sourceCountries: {
      propDefinition: [
        app,
        "sourceCountries",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    minSentiment: {
      propDefinition: [
        app,
        "minSentiment",
      ],
    },
    maxSentiment: {
      propDefinition: [
        app,
        "maxSentiment",
      ],
    },
    earliestPublishedDate: {
      propDefinition: [
        app,
        "earliestPublishedDate",
      ],
    },
    latestPublishedDate: {
      propDefinition: [
        app,
        "latestPublishedDate",
      ],
    },
    newsSources: {
      propDefinition: [
        app,
        "newsSources",
      ],
    },
    authors: {
      propDefinition: [
        app,
        "authors",
      ],
    },
    entities: {
      propDefinition: [
        app,
        "entities",
      ],
    },
    locationFilter: {
      propDefinition: [
        app,
        "locationFilter",
      ],
    },
    sort: {
      propDefinition: [
        app,
        "sort",
      ],
    },
    sortDirection: {
      propDefinition: [
        app,
        "sortDirection",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
    number: {
      propDefinition: [
        app,
        "number",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      "text": this.text,
      "source-countries": this.sourceCountries?.join(","), // comma-separated list
      "language": this.language,
      "min-sentiment": this.minSentiment,
      "max-sentiment": this.maxSentiment,
      "earliest-published-date": this.earliestPublishedDate,
      "latest-published-date": this.latestPublishedDate,
      "news-sources": this.newsSources?.join(","), // comma-separated list
      "authors": this.authors?.join(","), // comma-separated list
      "entities": this.entities?.join(","), // comma-separated list
      "location-filter": this.locationFilter,
      "sort": this.sort,
      "sort-direction": this.sortDirection,
      "offset": this.offset,
      "number": this.number,
    };
    const res = await this.app.searchNews(params, $);
    $.export("$summary", `Found ${res.available} news`);
    return res;
  },
};
