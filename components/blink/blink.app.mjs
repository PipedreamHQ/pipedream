import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blink",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team",
    },
    feedEventId: {
      type: "string",
      label: "Feed Event ID",
      description: "The ID of the feed event",
    },
    apiEndpoint: {
      type: "string",
      label: "API Endpoint",
      description: "The endpoint of the API",
    },
    method: {
      type: "string",
      label: "Method",
      description: "The HTTP method of the request",
    },
    data: {
      type: "object",
      label: "Data",
      description: "The data to send with the request",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.joinblink.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        data,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCard({
      userId, teamId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/feed/${userId || teamId}`,
        data,
      });
    },
    async getFeedEvent({ feedEventId }) {
      return this._makeRequest({
        path: `/feed/event/${feedEventId}`,
      });
    },
    async callAPI({
      apiEndpoint, method, data,
    }) {
      return this._makeRequest({
        method,
        path: apiEndpoint,
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
