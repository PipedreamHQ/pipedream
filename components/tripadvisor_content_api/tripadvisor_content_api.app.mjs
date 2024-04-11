import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tripadvisor_content_api",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The unique identifier for the location.",
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "The search query to find locations.",
      optional: true,
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location for a nearby search.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location for a nearby search.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tripadvisor.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        params,
        data,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-TripAdvisor-API-Key": `${this.$auth.api_key}`,
        },
        params,
        data,
      });
    },
    async getLocationDetails({ locationId }) {
      return this._makeRequest({
        path: `/locations/${locationId}`,
      });
    },
    async getLocationPhotos({ locationId }) {
      return this._makeRequest({
        path: `/locations/${locationId}/photos`,
      });
    },
    async getLocationReviews({ locationId }) {
      return this._makeRequest({
        path: `/locations/${locationId}/reviews`,
      });
    },
    async searchForLocations({ query }) {
      return this._makeRequest({
        path: "/locations/search",
        params: {
          query,
        },
      });
    },
    async searchForNearbyLocations({
      latitude, longitude,
    }) {
      return this._makeRequest({
        path: "/locations/mapsearch",
        params: {
          latitude,
          longitude,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
