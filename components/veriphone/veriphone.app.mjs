import { axios } from "@pipedream/platform";
import {
  COUNTRY_OPTIONS, PHONE_TYPE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "veriphone",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number you wish to verify.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code. The country will be infered from the IP address if this parameter is absent or invalid.",
      options: COUNTRY_OPTIONS,
    },
    phoneType: {
      type: "string",
      label: "Phone Type",
      description: "The type of phone number.",
      options: PHONE_TYPE_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.veriphone.io/v2";
    },
    _auth() {
      return {
        key: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          ...this._auth(),
        },
        ...opts,
      });
    },
    async verifyPhoneNumber(opts = {}) {
      return this._makeRequest({
        path: "/verify",
        ...opts,
      });
    },
    async getDummyPhoneNumber( opts = {}) {
      return this._makeRequest({
        path: "/example",
        ...opts,
      });
    },
  },
};
