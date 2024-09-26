import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "outscraper",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task you want to track.",
    },
    timeInterval: {
      type: "integer",
      label: "Time Interval",
      description: "The interval at which the platform will check the task status (in seconds).",
      optional: true,
      default: 60,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query, comprising of category, city/zip, and country.",
    },
    links: {
      type: "boolean",
      label: "Include Links",
      description: "Whether to include links in the search results.",
      optional: true,
    },
    placeIds: {
      type: "boolean",
      label: "Include Place IDs",
      description: "Whether to include Place IDs in the search results.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to find email addresses, social links, and phone numbers for.",
    },
    coordinates: {
      type: "string",
      label: "Coordinates",
      description: "The latitude and longitude of the location to translate into a human-readable address, e.g. `37.427074,-122.1439166`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.app.outscraper.com";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_token,
        },
      });
    },
    async searchPlaces(args) {
      return this._makeRequest({
        url: "/maps/search-v3",
        ...args,
      });
    },
    async findDomainData(args) {
      return this._makeRequest({
        url: "/emails-and-contacts",
        ...args,
      });
    },
    async translateLocation(args) {
      return this._makeRequest({
        url: "/reverse-geocoding",
        ...args,
      });
    },
    async getRequests() {
      return this._makeRequest({
        url: "/requests",
        params: {
          type: "finished",
        },
      });
    },
    async getRequestData(requestId) {
      return this._makeRequest({
        url: `/requests/${requestId}`,
      });
    },
  },
};
