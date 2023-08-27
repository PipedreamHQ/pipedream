import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "metaphor",
  propDefinitions: {
    endCrawlDate: {
      type: "string",
      label: "End Crawl Date",
      description: "\"Crawl date\" refers to the date that Metaphor discovered a link, which is more granular and can be more useful than published date. If endCrawlDate is specified, results will only include links that were crawled before endCrawlDate. Must be specified in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
    },
    endPublishedDate: {
      type: "string",
      label: "End Published Date",
      description: "If specified, only links with a published date before endPublishedDate will be returned. Must be specified in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ). Note that for some links, we have no published date, and these links will be excluded from the results if endPublishedDate is specified.",
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "List of domains to exclude in the search. If specified, results will only come from these domains. Only one of includeDomains and excludeDomains should be specified.",
    },
    includeDomains: {
      type: "string[]",
      label: "Include Domains",
      description: "List of domains to include in the search. If specified, results will only come from these domains. Only one of includeDomains and excludeDomains should be specified.",
    },
    numResults: {
      type: "integer",
      label: "Number Of Results",
      description: "Number of search results to return. Default 10. Up to 30 for basic plans. Up to thousands for custom plans.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query string. On the web, people often recommend content - it's vital that the query takes the form of a declarative suggestion, where a high quality search result link would follow.",
    },
    startCrawlDate: {
      type: "string",
      label: "Start Crawl Date",
      description: "\"Crawl date\" refers to the date that Metaphor discovered a link, which is more granular and can be more useful than published date. If startCrawlDate is specified, results will only include links that were crawled after startCrawlDate. Must be specified in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
    },
    startPublishedDate: {
      type: "string",
      label: "Start Published Date",
      description: "If specified, only links with a published date after startPublishedDate will be returned. Must be specified in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ). Note that for some links, we have no published date, and these links will be excluded from the results if startPublishedDate is specified.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The Type of search. Default: **neural**",
      options: [
        "keyword",
        "neural",
      ],
    },
    url: {
      type: "string",
      label: "Url",
      description: "\"Crawl date\" refers to the date that Metaphor discovered a link, which is more granular and can be more useful than published date. If endCrawlDate is specified, results will only include links that were crawled before endCrawlDate. Must be specified in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
    },
    useAutoprompt: {
      type: "boolean",
      label: "Use Autoprompt",
      description: "The url for which you would like to find similar links.",
      default: false,
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.metaphor.systems";
    },
    _getHeaders() {
      return {
        "accept": "application/json",
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    getContents(args = {}) {
      return this._makeRequest({
        path: "contents",
        ...args,
      });
    },
    search(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "search",
        ...args,
      });
    },
    findSimilarLinks(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "findSimilar",
        ...args,
      });
    },
  },
};
