import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "new_york_times",
  propDefinitions: {
    facet: {
      type: "string",
      label: "Facet",
      description: "A comma-separated list of fields to facet on. Facets are used to group results based on the values of a specific field.",
      optional: true,
    },
    facetFields: {
      type: "string[]",
      label: "Facet Fields",
      description: "A list of fields to facet on. This is similar to `facet` but allows for an array of fields.",
      optional: true,
    },
    facetFilter: {
      type: "boolean",
      label: "Facet Filter",
      description: "A boolean to toggle filtering on facet fields. When true, facet counts are based on the documents that match all other search criteria.",
      optional: true,
    },
    fl: {
      type: "string",
      label: "Field List",
      description: "A comma-separated list of fields to return in the result set.",
      optional: true,
    },
    fq: {
      type: "string",
      label: "Filtered Query",
      description: "A query to filter the search results. This parameter supports the same syntax as the `q` parameter.",
      optional: true,
    },
    q: {
      type: "string",
      label: "Query",
      description: "Search query term. Search is performed on the article body, headline, and byline.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.nytimes.com/svc";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, params, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        params: {
          "api-key": this.$auth.api_key,
          ...params,
        },
        headers: {
          ...headers,
        },
      });
    },
    async searchArticles({
      facet, facetFields, facetFilter, fl, fq, q,
    } = {}) {
      return this._makeRequest({
        path: "/search/v2/articlesearch.json",
        params: {
          facet,
          "facet_fields": facetFields && facetFields.join(","),
          "facet_filter": facetFilter,
          fl,
          fq,
          q,
        },
      });
    },
  },
};
