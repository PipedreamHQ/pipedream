import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faraday",
  propDefinitions: {
    personData: {
      type: "object",
      label: "Person's Data",
      description: "The data of the person for whom prediction is to be generated",
      optional: false,
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The API Key for Faraday",
      optional: false,
      secret: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.faraday.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
    },
    async generatePrediction(personData) {
      return this._makeRequest({
        method: "POST",
        path: "/v3/predictions",
        data: personData,
      });
    },
  },
};
