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
      placeId, ...opts
    }) {
      return this._makeRequest({
        path: `people/${placeId}`,
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
