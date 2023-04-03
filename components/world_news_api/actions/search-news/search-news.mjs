import app from "../../world_news_api.app.mjs";
import countryCodes from "../../common/country_codes.mjs";
import languages from "../../common/country_codes.mjs";
import options from "../../common/options.mjs";

export default {
  name: "Search News",
  description: "Search and filter news. [See the docs here](https://worldnewsapi.com/docs/)",
  key: "world_news_api-search-news",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The text to match in the news content.",
      optional: true,
    },
    sourceCountries: {
      type: "string[]",
      label: "Source Countries",
      description: "List of [ISO 3166 country codes](https://worldnewsapi.com/docs/#Country-Codes) from which the news should originate.",
      optional: true,
      options: countryCodes,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The [ISO 6391](https://worldnewsapi.com/docs/#Language-Codes) language code of the news.",
      optional: true,
      options: languages,
    },
    minSentiment: {
      type: "string",
      label: "Minimum Sentiment",
      description: "The minimum sentiment of the news.",
      optional: true,
    },
    maxSentiment: {
      type: "string",
      label: "Maximum Sentiment",
      description: "The maximum sentiment of the news.",
      optional: true,
    },
    earliestPublishedDate: {
      type: "string",
      label: "Earliest Published Date",
      description: "The news must have been published after this date. `YYYY-MM-DD HH:MM:SS` format",
      optional: true,
    },
    latestPublishedDate: {
      type: "string",
      label: "Latest Published Date",
      description: "The news must have been published before this date. `YYYY-MM-DD HH:MM:SS` format",
      optional: true,
    },
    newsSources: {
      type: "string[]",
      label: "News Sources",
      description: "A list of news sources from which the news should originate.",
      optional: true,
    },
    authors: {
      type: "string[]",
      label: "Authors",
      description: "A list of authors of the news.",
      optional: true,
    },
    entities: {
      type: "string[]",
      label: "Entities",
      description: "Filter news by entities [(see semantic types)](https://worldnewsapi.com/docs/#Semantic-Types).",
      optional: true,
    },
    locationFilter: {
      type: "string",
      label: "Location Filter",
      description: "Filter news by radius around a certain location. Format is `latitude,longitude,radius in kilometers`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort the news by a certain field.",
      optional: true,
      options: options.SORT_BY,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort the news in ascending or descending order.",
      optional: true,
      options: options.SORT_DIRECTION,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of news to skip in range. `(0-1000)`",
      optional: true,
      min: 0,
      max: 1000,
    },
    number: {
      type: "integer",
      label: "Number",
      description: "The number of news to return in range. `(0-100)`",
      optional: true,
      min: 0,
      max: 100,
    },
  },
  async run({ $ }) {
    const data = {
      "text": this.text,
      "source-countries": this.sourceCountries?.join(","), // comma-separated list
      "language": this.language,
      "min-sentiment": this.minSentiment,
      "max-sentiment": this.maxSentiment,
      "earliest-published-date": this.earliestPublishedDate,
      "latest-published-date": this.latestPublishedDate,
      "news-sources": this.newsSources?.join(","), // comma-separated list
      "authors": this.authors?.join(","), // comma-separated list
      "entities": this.entities,
      "location-filter": this.locationFilter,
      "sort": this.sort,
      "sort-direction": this.sortDirection,
      "offset": this.offset,
      "number": this.number,
    };
    const res = await this.app.searchNews(data, $);
    $.export("$summary", `Found ${res.available} news`);
    return res;
  },
};
