import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agify",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name that will be checked",
    },
    names: {
      type: "string[]",
      label: "Names",
      description: "Up to 10 names to check in a single batch request",
    },
    countryId: {
      type: "string",
      label: "Country",
      description: "Optional ISO 3166-1 alpha-2 country code (e.g. `US`, `GB`, `DE`) to constrain the prediction to a specific country's name distribution.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.agify.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        params: {
          api_key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async getAgeFromName(args = {}) {
      return this._makeRequest({
        ...args,
      });
    },
    async getAgeFromNames(args = {}) {
      return this._makeRequest({
        ...args,
      });
    },
  },
};
