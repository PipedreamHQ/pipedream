import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faraday",
  propDefinitions: {
    placeId: {
      type: "string",
      label: "Place ID",
      description: "The unique identifier for a place.",
    },
    placeData: {
      type: "object",
      label: "Place Data",
      description: "The data used to create or update a place.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.faraday.ai/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        data,
        params,
      });
    },
    async createPlace({ placeData }) {
      return this._makeRequest({
        method: "POST",
        path: "/places",
        data: placeData,
      });
    },
    async getPlaces() {
      return this._makeRequest({
        path: "/places",
      });
    },
    async deletePlace({ placeId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/places/${placeId}`,
      });
    },
    async updatePlace({
      placeId, placeData,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/places/${placeId}`,
        data: placeData,
      });
    },
  },
  version: "0.0.{{ts}}",
};
