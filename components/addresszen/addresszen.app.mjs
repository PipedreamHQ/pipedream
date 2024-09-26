import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "addresszen",
  propDefinitions: {
    addressLine: {
      type: "string",
      label: "Address Line",
      description: "The US address to verify.",
    },
    city: {
      type: "string",
      label: "City",
      description: "The US city of the address.",
    },
    state: {
      type: "string",
      label: "State",
      description: "The US state of the address. 2 letter code or full state name are accepted.",
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The zip code of the address.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.addresszen.com/v1";
    },
    _params(params = {}) {
      return {
        ...params,
        api_key: `${this.$auth.key}`,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    verifyAddress(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify/addresses",
        ...opts,
      });
    },
  },
};
