import app from "../../world_news_api.app.mjs";
import { getCommaSeparatedListFromArray } from "../../common/helpers.mjs";

export default {
  name: "Search News",
  description: "Search and filter news. [See the docs here](https://worldnewsapi.com/docs/#Search-News). **Calling this endpoint requires 1 point**",
  key: "world_news_api-search-news",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      "text": this.text || undefined,
      "source-countries": getCommaSeparatedListFromArray(this.sourceCountries),
      "language": this.language || undefined,
      "min-sentiment": this.minSentiment || undefined,
      "max-sentiment": this.maxSentiment || undefined,
      "earliest-publish-date": this.earliestPublishedDate || undefined,
      "latest-publish-date": this.latestPublishedDate || undefined,
      "news-sources": getCommaSeparatedListFromArray(this.newsSources),
      "authors": getCommaSeparatedListFromArray(this.authors),
      "entities": getCommaSeparatedListFromArray(this.entities),
      "location-filter": this.locationFilter || undefined,
      "sort": this.sort || undefined,
      "sort-direction": this.sortDirection || undefined,
      "offset": this.offset || undefined,
      "number": this.number || undefined,
    };
    const res = await this.app.searchNews(params, $);
    $.export("$summary", `Found ${res.available} news`);
    return res;
  },
};
