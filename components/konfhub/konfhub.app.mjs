import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "konfhub",
  propDefinitions: {
    eventReference: {
      type: "string",
      label: "Event Reference",
      description: "The unique identifier for the event.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.konfhub.com";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
  },
};
