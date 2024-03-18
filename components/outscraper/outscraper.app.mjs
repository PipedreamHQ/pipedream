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
    location: {
      type: "string",
      label: "Location",
      description: "The geographic location to translate into a human-readable address, as a pair of latitude and longitude values.",
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
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    async checkTaskStatus({
      taskId, timeInterval,
    }) {
      return this._makeRequest({
        url: `/tasks/${taskId}`,
        params: {
          interval: timeInterval,
        },
      });
    },
    async searchPlaces({
      query, links, placeIds,
    }) {
      return this._makeRequest({
        method: "POST",
        url: "/google-maps-places",
        data: {
          query,
          links,
          placeIds,
        },
      });
    },
    async findDomainData({ domain }) {
      return this._makeRequest({
        url: "/domains-contacts",
        params: {
          domain,
        },
      });
    },
    async translateLocation({ location }) {
      return this._makeRequest({
        url: "/reverse-geocode",
        params: {
          location,
        },
      });
    },
  },
};
