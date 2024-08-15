import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "addresszen",
  propDefinitions: {
    addressLine: {
      type: "string",
      label: "Address Line",
      description: "The single address line to verify and correct",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the address",
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the address",
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The zip code of the address",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.addresszen.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async verifyAndCorrectAddressByCityState({
      addressLine, city, state,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/verify-address",
        data: {
          addressLine,
          city,
          state,
        },
      });
    },
    async verifyAndCorrectAddressByZipCode({
      addressLine, zipCode,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/verify-address",
        data: {
          addressLine,
          zipCode,
        },
      });
    },
    async verifyAndCorrectFreeformAddress({ addressLine }) {
      return this._makeRequest({
        method: "POST",
        path: "/verify-address",
        data: {
          addressLine,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
