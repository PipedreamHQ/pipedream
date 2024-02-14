import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tpscheck",
  propDefinitions: {
    number: {
      type: "integer",
      label: "Number",
      description: "The non-negative integer to validate against the TPS/CTPS register",
      min: 0,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://www.tpscheck.uk/api";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async validateNumber({ number }) {
      const response = await this._makeRequest({
        path: `/validate?number=${number}`,
      });
      return response.registered;
    },
  },
  version: "0.0.{{ts}}",
};
