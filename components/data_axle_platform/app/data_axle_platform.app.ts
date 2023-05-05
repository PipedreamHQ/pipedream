import { axios } from "@pipedream/platform";
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "data_axle_platform",
  propDefinitions: {
    infogroupId: {
      type: "string",
      label: "Infogroup Id",
      description: "The Id of the place.",
    },
    packages: {
      type: "string",
      label: "Packages",
      description: "Packages of fields that provide which fields will be returned. By default, every field on a package is returned.",
    },
    personId: {
      type: "string",
      label: "Person Id",
      description: "The unique identifier for the person.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.data-axle.com/v1";
    },
    _getHeaders() {
      return {
        "X-AUTH-TOKEN": this.$auth.api_token,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    getPersonById({
      personId, ...opts
    }) {
      return this._makeRequest({
        path: `people/${personId}`,
        ...opts,
      });
    },
    searchPlaces(opts = {}) {
      return this._makeRequest({
        path: "places/search",
        ...opts,
      });
    },
  },
});
