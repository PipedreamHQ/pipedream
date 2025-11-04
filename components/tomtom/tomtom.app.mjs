import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "tomtom",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the search results",
      options: constants.LANGUAGES,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the search center",
    },
    lon: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the search center",
    },
    radius: {
      type: "string",
      label: "Radius",
      description: "The radius of the search area in meters",
      optional: true,
    },
    limit: {
      type: "string",
      label: "Limit",
      description: "The maximum number of results to return",
      optional: true,
    },
    extension: {
      type: "string",
      label: "Extension",
      description: "Expected response format",
      options: constants.EXTENSIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tomtom.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },

    async autocompleteSearch({
      extension,
      query,
      ...args
    }) {
      return this._makeRequest({
        path: `/search/2/autocomplete/${query}.${extension}`,
        ...args,
      });
    },

    async nearbySearch({
      extension,
      ...args
    }) {
      return this._makeRequest({
        path: `/search/2/nearbySearch/.${extension}`,
        ...args,
      });
    },
    async poiSearch({
      extension,
      query,
      ...args
    }) {
      return this._makeRequest({
        path: `/search/2/poiSearch/${query}.${extension}`,
        ...args,
      });
    },
  },
};
